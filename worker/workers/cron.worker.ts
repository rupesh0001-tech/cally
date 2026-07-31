import { Queue, Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";
import { emailQueue } from "../queues/booking-queues";

export const cronQueue = new Queue("cron-queue", {
  connection: redisConnection,
});

export const cronWorker = new Worker(
  "cron-queue",
  async (job: Job) => {
    console.log(`[Cron Worker] Running scheduled job: ${job.name}`);

    if (job.name === "cleanup-expired-reservations") {
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      
      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: "pending_payment",
          createdAt: {
            lt: fifteenMinsAgo,
          },
        },
      });

      if (expiredBookings.length > 0) {
        console.log(`[Cron Worker] Cleaning up ${expiredBookings.length} expired reservations...`);
        await prisma.booking.updateMany({
          where: {
            id: { in: expiredBookings.map((b) => b.id) },
          },
          data: {
            status: "cancelled",
          },
        });
      }
    } else if (job.name === "upcoming-reminders") {
      const now = new Date();
      const next24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const upcomingBookings = await prisma.booking.findMany({
        where: {
          status: "confirmed",
          startTime: {
            gte: now,
            lte: next24Hours,
          },
        },
      });

      const bookingsToRemind = upcomingBookings.filter(
        (b) => !(b.bookingFieldsData as any)?.reminderSent
      );

      console.log(`[Cron Worker] Found ${bookingsToRemind.length} bookings requiring a reminder.`);

      for (const booking of bookingsToRemind) {
        await emailQueue.add("booking-reminder", {
          bookingId: booking.id,
          type: "booking-reminder",
        });

        const existingData = (booking.bookingFieldsData as Record<string, any>) || {};
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            bookingFieldsData: {
              ...existingData,
              reminderSent: true,
            },
          },
        });
      }
    }
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);

export async function setupCronSchedules() {
  const repeatableJobs = await cronQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await cronQueue.removeRepeatableByKey(job.key);
  }

  // Cleanup runs every 5 minutes
  await cronQueue.add(
    "cleanup-expired-reservations",
    {},
    {
      repeat: {
        pattern: "*/5 * * * *",
      },
    }
  );

  // Reminders run every hour
  await cronQueue.add(
    "upcoming-reminders",
    {},
    {
      repeat: {
        pattern: "0 * * * *",
      },
    }
  );

  console.log("[Cron Worker] Recurring cron schedules registered successfully.");
}
