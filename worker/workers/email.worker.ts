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

    const { attendeeEmail, attendeeName, startTime, eventType } = booking;
    const hostUser = eventType.user;
    const hostName = `${hostUser.firstName || ""} ${hostUser.lastName || ""}`.trim() || hostUser.username || hostUser.email;
    const hostEmail = hostUser.email;

    // Secure tokens & links
    const token = generateBookingToken(bookingId);
    const frontendUrl = env.FRONTEND_URL || process.env.FRONTEND_URL || "https://cally.rupeshhh.in";
    const cancelUrl = `${frontendUrl}/booking/${bookingId}/cancel?token=${token}`;
    const rescheduleUrl = `${frontendUrl}/booking/${bookingId}?reschedule=true&token=${token}`;

    // Date & Time formatting
    const eventDate = new Date(startTime);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    // Location & Google Meet link resolution
    const fieldsData = (booking.bookingFieldsData as Record<string, any>) || {};
    const hangoutLink = fieldsData.hangoutLink || fieldsData.meetLink;
    const locationDetails = eventType.locationDetails;

    let googleMeetUrl: string | null = null;
    if (hangoutLink && typeof hangoutLink === "string" && hangoutLink.startsWith("http")) {
      googleMeetUrl = hangoutLink;
    } else if (locationDetails && typeof locationDetails === "string" && locationDetails.startsWith("http")) {
      googleMeetUrl = locationDetails;
    }

    let locationLabel = "Google Meet";
    if (googleMeetUrl) {
      locationLabel = `<a href="${googleMeetUrl}" style="color: #1a73e8; font-weight: 600; text-decoration: underline;">Join Google Meet</a>`;
    } else if (locationDetails) {
      locationLabel = locationDetails;
    } else if (eventType.locationType) {
      locationLabel = eventType.locationType === "google_meet" ? "Google Meet" : eventType.locationType;
    }

    const meetButtonHtml = googleMeetUrl
      ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${googleMeetUrl}" style="display: inline-block; background-color: #1a73e8; color: #ffffff; font-weight: 600; font-size: 15px; padding: 12px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(26,115,232,0.3);">
            📹 Join Google Meet
          </a>
          <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Direct Link: <a href="${googleMeetUrl}" style="color: #1a73e8;">${googleMeetUrl}</a></p>
        </div>
      `
      : "";

    let subject = "";
    let html = "";

    if (type === "booking-confirmation") {
      subject = `Confirmed: ${eventType.title} with ${hostName}`;
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #0f172a;">
          <div style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">Cally</h1>
          </div>
          <div style="padding: 32px;">
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; color: #166534; font-weight: 600; font-size: 14px;">
              ✓ Meeting Confirmed
            </div>
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a;">${eventType.title}</h2>
            <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
              Hi <strong>${attendeeName}</strong>, your appointment with <strong>${hostName}</strong> has been successfully scheduled.
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Host:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${hostName} (${hostEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Guest:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${attendeeName} (${attendeeEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>When:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Duration:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${eventType.duration} minutes</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Location:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${locationLabel}</td>
                </tr>
              </table>
            </div>

            ${meetButtonHtml}

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Need to make changes or cancel?</p>
              <div>
                <a href="${rescheduleUrl}" style="display: inline-block; padding: 10px 20px; font-size: 13px; font-weight: 600; color: #2563eb; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; text-decoration: none; margin-right: 8px;">Reschedule Meeting</a>
                <a href="${cancelUrl}" style="display: inline-block; padding: 10px 20px; font-size: 13px; font-weight: 600; color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; text-decoration: none;">Cancel Meeting</a>
              </div>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Automated email sent by <strong>Cally</strong> scheduling assistant.</p>
          </div>
        </div>
      `;
    } else if (type === "booking-reminder") {
      subject = `Reminder: ${eventType.title} with ${hostName}`;
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #0f172a;">
          <div style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">Cally</h1>
          </div>
          <div style="padding: 32px;">
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; color: #1e40af; font-weight: 600; font-size: 14px;">
              ⏰ Upcoming Meeting Reminder
            </div>
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a;">${eventType.title}</h2>
            <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
              Hi <strong>${attendeeName}</strong>, this is a reminder that your meeting with <strong>${hostName}</strong> is coming up.
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Host:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${hostName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>When:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Location:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${locationLabel}</td>
                </tr>
              </table>
            </div>

            ${meetButtonHtml}

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
              <div>
                <a href="${rescheduleUrl}" style="display: inline-block; padding: 10px 20px; font-size: 13px; font-weight: 600; color: #2563eb; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; text-decoration: none; margin-right: 8px;">Reschedule</a>
                <a href="${cancelUrl}" style="display: inline-block; padding: 10px 20px; font-size: 13px; font-weight: 600; color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; text-decoration: none;">Cancel Meeting</a>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === "booking-cancellation") {
      subject = `Cancelled: ${eventType.title} with ${hostName}`;
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #0f172a;">
          <div style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">Cally</h1>
          </div>
          <div style="padding: 32px;">
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; color: #991b1b; font-weight: 600; font-size: 14px;">
              ✕ Meeting Cancelled
            </div>
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a;">${eventType.title}</h2>
            <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
              Hi <strong>${attendeeName}</strong>, the meeting <strong>${eventType.title}</strong> scheduled for ${formattedDate} has been cancelled.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Cally Scheduling Assistant</p>
          </div>
        </div>
      `;
    }

    if (resend) {
      try {
        const recipients = [attendeeEmail];
        if (hostEmail && hostEmail !== attendeeEmail) {
          recipients.push(hostEmail);
        }

        const response = await resend.emails.send({
          from: `Cally <${SENDER_EMAIL}>`,
          to: recipients,
          subject,
          html,
        });
        console.log(`[Email Worker] ✅ Email sent via Resend to ${recipients.join(", ")}, Resend ID: ${response.data?.id}`);
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
