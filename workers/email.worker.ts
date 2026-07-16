import { Worker, Job } from "bullmq";
import { Resend } from "resend";
import { env } from "../config/env";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";

let resend: Resend | null = null;
if (env.RESEND_API_KEY && env.RESEND_API_KEY !== "re_123456789") {
  resend = new Resend(env.RESEND_API_KEY);
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
    const hostName = `${eventType.user.firstName || ""} ${eventType.user.lastName || ""}`.trim() || eventType.user.email;

    let subject = "";
    let html = "";

    if (type === "booking-confirmation") {
      subject = `Confirmed: ${eventType.title} with ${hostName}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; color: #171614; background-color: #FDFBF2; border: 2px solid #171614; border-radius: 12px; max-width: 600px;">
          <h2 style="font-family: sans-serif; text-transform: uppercase; font-weight: 800; margin-bottom: 15px;">Appointment Confirmed!</h2>
          <p>Hi <strong>${attendeeName}</strong>,</p>
          <p>Your meeting <strong>${eventType.title}</strong> with <strong>${hostName}</strong> is scheduled successfully.</p>
          <p><strong>Scheduled Time:</strong> ${new Date(startTime).toLocaleString()}</p>
          <p><strong>Meeting Channel:</strong> ${eventType.locationType} (${eventType.locationDetails || "Google Meet"})</p>
          <p style="margin-top: 25px; font-size: 11px; opacity: 0.6;">This is an automated email from your scheduling assistant.</p>
        </div>
      `;
    } else if (type === "booking-reminder") {
      subject = `Reminder: Upcoming session: ${eventType.title}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; color: #171614; background-color: #FDFBF2; border: 2px solid #171614; border-radius: 12px; max-width: 600px;">
          <h2 style="font-family: sans-serif; text-transform: uppercase; font-weight: 800; margin-bottom: 15px;">Upcoming Meeting Reminder</h2>
          <p>Hi <strong>${attendeeName}</strong>,</p>
          <p>This is a reminder that your meeting <strong>${eventType.title}</strong> with <strong>${hostName}</strong> starts in less than 24 hours.</p>
          <p><strong>Scheduled Time:</strong> ${new Date(startTime).toLocaleString()}</p>
          <p><strong>Meeting Channel:</strong> ${eventType.locationType} (${eventType.locationDetails || "Google Meet"})</p>
        </div>
      `;
    } else if (type === "booking-cancellation") {
      subject = `Cancelled: ${eventType.title} with ${hostName}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; color: #171614; background-color: #FDFBF2; border: 2px solid #E5484D; border-radius: 12px; max-width: 600px;">
          <h2 style="font-family: sans-serif; text-transform: uppercase; font-weight: 800; color: #E5484D; margin-bottom: 15px;">Meeting Cancelled</h2>
          <p>Hi <strong>${attendeeName}</strong>,</p>
          <p>The meeting <strong>${eventType.title}</strong> scheduled for ${new Date(startTime).toLocaleString()} has been cancelled.</p>
        </div>
      `;
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: `Calendly Clone <${env.EMAIL_FROM}>`,
          to: [attendeeEmail],
          subject,
          html,
        });
        console.log(`[Email Worker] Email sent successfully via Resend to ${attendeeEmail}`);
      } catch (err) {
        console.error("[Email Worker] Resend API error:", err);
        throw err;
      }
    } else {
      console.log(`[Email Worker] [MOCK EMAIL SENT]
To: ${attendeeEmail}
Subject: ${subject}
Body: ${html.replace(/<[^>]*>/g, "").trim().replace(/\s+/g, " ")}`);
    }
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);
