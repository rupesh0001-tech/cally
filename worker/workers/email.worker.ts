import { Worker, Job } from "bullmq";
import { Resend } from "resend";
import crypto from "crypto";
import { env } from "../config/env";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";

const RESEND_KEY = env.RESEND_API_KEY || process.env.RESEND_API_KEY || "";
const SENDER_EMAIL = env.EMAIL_FROM || process.env.EMAIL_FROM || "otp@rupeshhh.in";

let resend: Resend | null = null;
if (RESEND_KEY && RESEND_KEY !== "re_123456789") {
  resend = new Resend(RESEND_KEY);
}

function generateBookingToken(bookingId: string): string {
  const secret = env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY || "cally_default_secret_34892";
  return crypto.createHmac("sha256", secret).update(bookingId).digest("hex");
}

function formatDateTimeRange(start: Date, end: Date, timezone?: string) {
  const timeZone = timezone || "Asia/Kolkata";
  
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });

  const dateStr = dateFormatter.format(start);
  const startTimeStr = timeFormatter.format(start);
  const endTimeStr = timeFormatter.format(end);

  return {
    dateStr,
    timeRangeStr: `${startTimeStr} – ${endTimeStr}`,
    timeZoneStr: timeZone,
  };
}

function generateGoogleCalendarUrl(
  title: string,
  start: Date,
  end: Date,
  details: string,
  location: string
): string {
  const toUtcIso = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
  const dates = `${toUtcIso(start)}/${toUtcIso(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const emailWorker = new Worker(
  "email",
  async (job: Job) => {
    const { bookingId, type } = job.data;
    console.log(`[Email Worker] Processing job for booking: ${bookingId}, type: ${type}`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { eventType: { include: { user: true } } },
    });

    if (!booking) {
      console.warn(`[Email Worker] Booking with ID ${bookingId} not found, skipping email.`);
      return;
    }

    const { attendeeEmail, attendeeName, attendeePhone, startTime, endTime: rawEndTime, eventType } = booking;
    const hostUser = eventType.user;
    const hostName = `${hostUser.firstName || ""} ${hostUser.lastName || ""}`.trim() || hostUser.username || hostUser.email;
    const hostEmail = hostUser.email;
    const hostTimezone = hostUser.timezone || "Asia/Kolkata";

    const startDate = new Date(startTime);
    const endDate = rawEndTime ? new Date(rawEndTime) : new Date(startDate.getTime() + eventType.duration * 60000);

    const { dateStr, timeRangeStr, timeZoneStr } = formatDateTimeRange(startDate, endDate, hostTimezone);

    // Secure tokens & management links
    const token = generateBookingToken(bookingId);
    const frontendUrl = env.FRONTEND_URL || process.env.FRONTEND_URL || "https://cally.rupeshhh.in";
    const cancelUrl = `${frontendUrl}/booking/${bookingId}/cancel?token=${token}`;
    const rescheduleUrl = `${frontendUrl}/booking/${bookingId}?reschedule=true&token=${token}`;

    // Resolve Google Meet / video call links
    const fieldsData = (booking.bookingFieldsData as Record<string, any>) || {};
    const hangoutLink = fieldsData.hangoutLink || fieldsData.meetLink;
    const locationDetails = eventType.locationDetails;

    let googleMeetUrl: string | null = null;
    if (hangoutLink && typeof hangoutLink === "string" && hangoutLink.startsWith("http")) {
      googleMeetUrl = hangoutLink;
    } else if (locationDetails && typeof locationDetails === "string" && locationDetails.startsWith("http")) {
      googleMeetUrl = locationDetails;
    }

    let locationDisplay = "Google Meet";
    if (googleMeetUrl) {
      locationDisplay = "Google Meet Video Call";
    } else if (locationDetails) {
      locationDisplay = locationDetails;
    } else if (eventType.locationType) {
      locationDisplay = eventType.locationType === "google_meet" ? "Google Meet" : eventType.locationType;
    }

    const gCalUrl = generateGoogleCalendarUrl(
      `${eventType.title}: ${attendeeName} and ${hostName}`,
      startDate,
      endDate,
      `Meeting scheduled via Cally.\nHost: ${hostName} (${hostEmail})\nGuest: ${attendeeName} (${attendeeEmail})\nMeeting Link: ${googleMeetUrl || locationDisplay}\nReschedule: ${rescheduleUrl}\nCancel: ${cancelUrl}`,
      googleMeetUrl || locationDisplay
    );

    let subject = "";
    let badgeText = "";
    let badgeBg = "#f0fdf4";
    let badgeColor = "#166534";
    let badgeBorder = "#bbf7d0";
    let headline = "";
    let subheadline = "";

    if (type === "booking-confirmation") {
      subject = `Confirmed: ${eventType.title} with ${hostName} on ${dateStr}`;
      badgeText = "✓ Meeting Confirmed";
      badgeBg = "#f0fdf4";
      badgeColor = "#166534";
      badgeBorder = "#bbf7d0";
      headline = "You're Scheduled!";
      subheadline = `A calendar invitation has been sent to <strong>${attendeeEmail}</strong> and <strong>${hostEmail}</strong>.`;
    } else if (type === "booking-reminder") {
      subject = `Reminder: ${eventType.title} with ${hostName} (${timeRangeStr})`;
      badgeText = "⏰ Upcoming Meeting Reminder";
      badgeBg = "#eff6ff";
      badgeColor = "#1e40af";
      badgeBorder = "#bfdbfe";
      headline = "Upcoming Appointment Reminder";
      subheadline = `Your scheduled meeting is coming up soon. Here are the details:`;
    } else if (type === "booking-cancellation") {
      subject = `Cancelled: ${eventType.title} with ${hostName} on ${dateStr}`;
      badgeText = "✕ Meeting Cancelled";
      badgeBg = "#fef2f2";
      badgeColor = "#991b1b";
      badgeBorder = "#fecaca";
      headline = "Meeting Cancelled";
      subheadline = `The appointment scheduled for <strong>${dateStr}</strong> has been cancelled.`;
    }

    const isCancelled = type === "booking-cancellation";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none;">Cally</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${badgeText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              
              <!-- Greeting & Headline -->
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3;">${headline}</h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #475569; line-height: 1.5;">${subheadline}</p>

              <!-- Event Details Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    
                    <!-- Event Title -->
                    <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
                      📌 ${eventType.title}
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <!-- Date -->
                      <tr>
                        <td width="30" valign="top" style="padding: 8px 0; font-size: 16px;">📅</td>
                        <td width="100" valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b;">Date</td>
                        <td valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${dateStr}</td>
                      </tr>
                      <!-- Time & Timezone -->
                      <tr>
                        <td width="30" valign="top" style="padding: 8px 0; font-size: 16px;">⏰</td>
                        <td width="100" valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b;">Time</td>
                        <td valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
                          ${timeRangeStr} <span style="font-size: 13px; font-weight: 500; color: #64748b;">(${eventType.duration} min • ${timeZoneStr})</span>
                        </td>
                      </tr>
                      <!-- Location / Meet -->
                      <tr>
                        <td width="30" valign="top" style="padding: 8px 0; font-size: 16px;">📍</td>
                        <td width="100" valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b;">Location</td>
                        <td valign="top" style="padding: 8px 0; font-size: 14px; color: #0f172a;">
                          ${googleMeetUrl ? `<a href="${googleMeetUrl}" style="color: #2563eb; font-weight: 600; text-decoration: underline;">${locationDisplay}</a>` : locationDisplay}
                        </td>
                      </tr>
                      <!-- Host Info -->
                      <tr>
                        <td width="30" valign="top" style="padding: 8px 0; font-size: 16px;">👤</td>
                        <td width="100" valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b;">Host</td>
                        <td valign="top" style="padding: 8px 0; font-size: 14px; color: #0f172a;">
                          <strong>${hostName}</strong> <span style="color: #64748b; font-size: 13px;">(${hostEmail})</span>
                        </td>
                      </tr>
                      <!-- Attendee Info -->
                      <tr>
                        <td width="30" valign="top" style="padding: 8px 0; font-size: 16px;">✉️</td>
                        <td width="100" valign="top" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b;">Attendee</td>
                        <td valign="top" style="padding: 8px 0; font-size: 14px; color: #0f172a;">
                          <strong>${attendeeName}</strong> <span style="color: #64748b; font-size: 13px;">(${attendeeEmail}${attendeePhone ? ` • ${attendeePhone}` : ""})</span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              ${!isCancelled && googleMeetUrl ? `
              <!-- Google Meet Primary CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${googleMeetUrl}" target="_blank" style="display: inline-block; background-color: #1a73e8; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 8px; box-shadow: 0 4px 12px rgba(26, 115, 232, 0.25);">
                      📹 Join Google Meet Call
                    </a>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
                      Direct Link: <a href="${googleMeetUrl}" style="color: #1a73e8; text-decoration: underline;">${googleMeetUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
              ` : ""}

              ${!isCancelled ? `
              <!-- Add To Calendar Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${gCalUrl}" target="_blank" style="display: inline-block; background-color: #f8fafc; color: #334155; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 24px; border-radius: 6px;">
                      📅 Add to Google Calendar
                    </a>
                  </td>
                </tr>
              </table>
              ` : ""}

              ${!isCancelled ? `
              <!-- Manage Booking Actions -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 8px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">Need to make adjustments to this booking?</p>
                    <div>
                      <a href="${rescheduleUrl}" style="display: inline-block; background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin: 4px;">
                        🔄 Reschedule Appointment
                      </a>
                      <a href="${cancelUrl}" style="display: inline-block; background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin: 4px;">
                        ✕ Cancel Appointment
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
              ` : ""}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #475569;">Cally Scheduling Platform</p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">This automated email was sent for booking ID: ${bookingId}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    if (resend) {
      try {
        const recipients: string[] = [];
        if (attendeeEmail && attendeeEmail.includes("@")) {
          recipients.push(attendeeEmail.trim());
        }
        if (hostEmail && hostEmail.includes("@") && !recipients.includes(hostEmail.trim())) {
          recipients.push(hostEmail.trim());
        }

        if (recipients.length === 0) {
          console.warn("[Email Worker] ⚠️ No valid recipients found, skipping email.");
          return;
        }

        const response = await resend.emails.send({
          from: `Cally <${SENDER_EMAIL}>`,
          to: recipients,
          subject,
          html,
        });

        if (response.error) {
          console.error("[Email Worker] ❌ Resend returned error:", JSON.stringify(response.error, null, 2));
          throw new Error(`Resend API Error: ${response.error.message}`);
        }

        const emailId = response.data?.id || (response as any).id || "Sent";
        console.log(`[Email Worker] ✅ Email sent via Resend to ${recipients.join(", ")}, Resend ID: ${emailId}`);
      } catch (err) {
        console.error("[Email Worker] ❌ Resend API error:", err);
        throw err;
      }
    } else {
      console.log(`[Email Worker] [MOCK EMAIL SENT]
From: Cally <${SENDER_EMAIL}>
To: ${attendeeEmail}, ${hostEmail}
Subject: ${subject}
Cancel URL: ${cancelUrl}
Meet URL: ${googleMeetUrl || "None"}
Body: ${html.replace(/<[^>]*>/g, "").trim().replace(/\s+/g, " ")}`);
    }
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);
