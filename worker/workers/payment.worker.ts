import { Worker, Job } from "bullmq";
import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";
import { emailQueue, calendarQueue, analyticsQueue } from "../queues/booking-queues";

export const paymentWorker = new Worker(
  "payment",
  async (job: Job) => {
    const { rawBody, signature } = job.data;
    console.log("[Payment Worker] Processing Razorpay webhook payment job...");

    // Webhook signature verification is mandatory — no bypass allowed
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      console.error("[Payment Worker] RAZORPAY_WEBHOOK_SECRET is not configured. Rejecting webhook to prevent payment injection.");
      throw new Error("Payment worker cannot process webhooks: RAZORPAY_WEBHOOK_SECRET is not set.");
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[Payment Worker] Razorpay webhook signature verification failed.");
      throw new Error("Invalid Razorpay webhook signature.");
    }
    console.log("[Payment Worker] Razorpay signature verified successfully.");

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Payment Worker] Webhook event type: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const bookingId = paymentEntity?.notes?.bookingId;

      if (!bookingId) {
        console.warn("[Payment Worker] No bookingId found in Razorpay payment notes, skipping.");
        return;
      }

      console.log(`[Payment Worker] Confirming payment for bookingId: ${bookingId}`);

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { eventType: true },
      });

      if (!booking) {
        console.error(`[Payment Worker] Booking not found for ID: ${bookingId}`);
        return;
      }

      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "confirmed" },
      });

      console.log(`[Payment Worker] Booking ${bookingId} confirmed successfully.`);

      await emailQueue.add("booking-confirmation", {
        bookingId: bookingId,
        type: "booking-confirmation",
      });

      await calendarQueue.add("create-event", {
        bookingId: bookingId,
        action: "create-event",
      });

      await analyticsQueue.add("update-stats", {
        bookingId: bookingId,
      });
    }
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);
export default paymentWorker;
