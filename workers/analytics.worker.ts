import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";

export const analyticsWorker = new Worker(
  "analytics",
  async (job: Job) => {
    const { bookingId } = job.data;
    console.log(`[Analytics Worker] Processing stats update for booking: ${bookingId}`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { eventType: true },
    });

    if (!booking) {
      console.warn(`[Analytics Worker] Booking with ID ${bookingId} not found, skipping stats update.`);
      return;
    }

    const hostId = booking.eventType.userId;

    // Fetch all confirmed bookings for the host's event types
    const bookings = await prisma.booking.findMany({
      where: {
        eventType: {
          userId: hostId,
        },
        status: "confirmed",
      },
      include: {
        eventType: true,
      },
    });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.eventType.price || 0), 0);

    // Upsert HostAnalytics record
    await prisma.hostAnalytics.upsert({
      where: { userId: hostId },
      update: {
        totalBookings,
        totalRevenue,
      },
      create: {
        userId: hostId,
        totalBookings,
        totalRevenue,
      },
    });

    console.log(`[Analytics Worker] Updated stats for host: ${hostId}. Total Bookings: ${totalBookings}, Revenue: $${totalRevenue}`);
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);
export default analyticsWorker;
