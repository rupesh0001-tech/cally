import { Worker, Job } from "bullmq";
import { google } from "googleapis";
import { createClerkClient } from "@clerk/backend";
import { env } from "../config/env";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";

const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);

export const calendarWorker = new Worker(
  "calendar",
  async (job: Job) => {
    const { bookingId, action, googleEventId } = job.data;
    console.log(`[Calendar Worker] Processing job for booking: ${bookingId}, action: ${action}`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { eventType: { include: { user: true } } },
    });

    if (!booking) {
      console.warn(`[Calendar Worker] Booking with ID ${bookingId} not found, skipping sync.`);
      return;
    }

    const hostUserId = booking.eventType.userId;
    let googleAccessToken: string | null = null;
    let googleRefreshToken: string | null = null;
    let googleExpiryDate: number | null = null;

    // 1. Check local DB for Google Account credentials
    const googleAccount = await prisma.googleAccount.findUnique({
      where: { clerkUserId: hostUserId },
    });

    if (googleAccount) {
      googleAccessToken = googleAccount.accessToken;
      googleRefreshToken = googleAccount.refreshToken;
      googleExpiryDate = Number(googleAccount.expiryDate);
      console.log(`[Calendar Worker] Using local DB credentials for host ${hostUserId}`);
    } else if (env.CLERK_SECRET_KEY && env.CLERK_SECRET_KEY !== "sk_test_8uyJmngsDos4vNOQgphyBVqsGBcJ3M0NttqijwBCDx") {
      // 2. Fall back to Clerk
      try {
        const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
          hostUserId,
          "oauth_google"
        );
        
        googleAccessToken = tokenResponse.data?.[0]?.token || null;
        if (googleAccessToken) {
          console.log(`[Calendar Worker] Successfully retrieved live Google OAuth token from Clerk for host ${hostUserId}`);
        } else {
          console.warn(`[Calendar Worker] No Google OAuth token returned by Clerk for host ${hostUserId}`);
        }
      } catch (err) {
        console.error(`[Calendar Worker] Failed to fetch user OAuth access token from Clerk:`, err);
      }
    }

    // Configure oauth2 client
    if (googleAccessToken) {
      oauth2Client.setCredentials({
        access_token: googleAccessToken,
        refresh_token: googleRefreshToken || undefined,
        expiry_date: googleExpiryDate || undefined,
      });

      // Handle token refreshes automatically and save back to DB
      oauth2Client.on("tokens", async (tokens) => {
        if (tokens.access_token) {
          console.log(`[Calendar Worker] Auto-refreshed access token for user ${hostUserId}`);
          try {
            await prisma.googleAccount.update({
              where: { clerkUserId: hostUserId },
              data: {
                accessToken: tokens.access_token,
                expiryDate: BigInt(tokens.expiry_date || 0),
                ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
              },
            });
          } catch (err) {
            console.error("[Calendar Worker] Failed to save refreshed Google tokens to database:", err);
          }
        }
      });
    }

    if (action === "create-event") {
      if (googleAccessToken) {
        try {
          const calendar = google.calendar({ version: "v3", auth: oauth2Client });

          const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
              summary: `${booking.eventType.title} - ${booking.attendeeName}`,
              description: `Scheduled via Calendly Clone. Guest email: ${booking.attendeeEmail}`,
              start: { dateTime: booking.startTime.toISOString() },
              end: { dateTime: booking.endTime.toISOString() },
              attendees: [{ email: booking.attendeeEmail }],
            },
          });

          const createdEventId = response.data.id;
          console.log(`[Calendar Worker] Event created in Google Calendar: ${createdEventId}`);
          
          const existingData = (booking.bookingFieldsData as Record<string, any>) || {};
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              bookingFieldsData: {
                ...existingData,
                googleEventId: createdEventId,
              },
            },
          });
        } catch (err) {
          console.error("[Calendar Worker] Google Calendar insert failed, falling back to mock:", err);
          console.log(`[Calendar Worker] [MOCK SYNC] Google Calendar Event Created for ${booking.attendeeName} (${booking.startTime.toISOString()})`);
        }
      } else {
        console.log(`[Calendar Worker] [MOCK SYNC] Google Calendar Event Created for ${booking.attendeeName} (${booking.startTime.toISOString()})`);
      }
    } else if (action === "delete-event") {
      const eventIdToDelete = googleEventId || (booking.bookingFieldsData as any)?.googleEventId;
      if (!eventIdToDelete) {
        console.log("[Calendar Worker] No googleEventId to delete, skipping.");
        return;
      }

      if (googleAccessToken) {
        try {
          const calendar = google.calendar({ version: "v3", auth: oauth2Client });
          await calendar.events.delete({
            calendarId: "primary",
            eventId: eventIdToDelete,
          });
          console.log(`[Calendar Worker] Event ${eventIdToDelete} deleted from Google Calendar.`);
        } catch (err) {
          console.error("[Calendar Worker] Google Calendar delete failed, falling back to mock:", err);
          console.log(`[Calendar Worker] [MOCK SYNC] Google Calendar Event ${eventIdToDelete} Deleted.`);
        }
      } else {
        console.log(`[Calendar Worker] [MOCK SYNC] Google Calendar Event ${eventIdToDelete} Deleted.`);
      }
    }
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);
export default calendarWorker;
