import { Worker, Job } from "bullmq";
import { google } from "googleapis";
import { env } from "../config/env";
import { redisConnection } from "../config/redis";
import { prisma } from "../config/database";

// ─── Token Refresh Helper ────────────────────────────────────────────────────
/**
 * Returns a fully-configured OAuth2 client with a valid (non-expired) access token.
 * - If the stored token is still valid (>= 5 min buffer), returns it as-is.
 * - If expired/expiring, calls Google to refresh it and persists the new tokens to DB.
 * Throws a clear error message on failure so the caller can log it properly.
 */
async function getAuthedClient(
  clerkUserId: string,
  accessToken: string,
  refreshToken: string | null,
  expiryDate: number | null
): Promise<InstanceType<typeof google.auth.OAuth2>> {
  // Create a fresh OAuth2 client per job — avoids shared state issues
  const client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );

  const BUFFER_MS = 5 * 60 * 1000; // 5 minutes before expiry
  const isExpired = !expiryDate || Date.now() >= expiryDate - BUFFER_MS;

  if (!isExpired) {
    // Token is still fresh — use it directly
    client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken ?? undefined,
      expiry_date: expiryDate ?? undefined,
    });
    return client;
  }

  // Token is expired or expiring soon — need to refresh
  if (!refreshToken) {
    throw new Error(
      "Access token expired and no refresh token is stored. " +
      "Please reconnect Google Calendar from Dashboard → Calendar."
    );
  }

  console.log(`[Calendar Worker] Access token expired for ${clerkUserId}, refreshing…`);

  client.setCredentials({
    refresh_token: refreshToken,
  });

  let newTokens: { access_token?: string | null; expiry_date?: number | null; refresh_token?: string | null };
  try {
    const { credentials } = await client.refreshAccessToken();
    newTokens = credentials;
  } catch (err: any) {
    const isClientMismatch = err?.message?.includes("invalid_client");
    if (isClientMismatch) {
      throw new Error(
        "Google OAuth client credentials mismatch (invalid_client). " +
        "The GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env do not match the app " +
        "that originally issued the stored refresh token. " +
        "Please reconnect Google Calendar from Dashboard → Calendar once to fix this permanently."
      );
    }
    throw new Error(`Token refresh failed: ${err?.message}`);
  }

  if (!newTokens.access_token) {
    throw new Error("Token refresh returned empty access_token.");
  }

  // Persist fresh tokens to DB so next job uses them without refreshing again
  await prisma.googleAccount.update({
    where: { clerkUserId },
    data: {
      accessToken: newTokens.access_token,
      expiryDate: BigInt(newTokens.expiry_date ?? 0),
      ...(newTokens.refresh_token ? { refreshToken: newTokens.refresh_token } : {}),
    },
  });

  console.log(`[Calendar Worker] ✅ Tokens refreshed & saved for ${clerkUserId}`);

  client.setCredentials({
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token ?? refreshToken,
    expiry_date: newTokens.expiry_date ?? undefined,
  });

  return client;
}

// ─── Worker ──────────────────────────────────────────────────────────────────
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
      console.warn(`[Calendar Worker] Booking ${bookingId} not found, skipping.`);
      return;
    }

    const hostUserId = booking.eventType.userId;

    // Load stored Google credentials from DB
    const googleAccount = await prisma.googleAccount.findUnique({
      where: { clerkUserId: hostUserId },
    });

    if (!googleAccount) {
      console.log(`[Calendar Worker] Host ${hostUserId} has no Google account connected. Skipping.`);
      return;
    }

    const settings = (googleAccount.settings as any) ?? {
      syncEnabled: true,
      addMeetLink: true,
      deleteOnCancel: true,
    };

    if (settings.syncEnabled === false) {
      console.log(`[Calendar Worker] Sync disabled by user settings for ${hostUserId}. Skipping.`);
      return;
    }

    // ── Get a valid, non-expired auth client ─────────────────────────────────
    let authClient: InstanceType<typeof google.auth.OAuth2>;
    try {
      authClient = await getAuthedClient(
        hostUserId,
        googleAccount.accessToken,
        googleAccount.refreshToken,
        googleAccount.expiryDate ? Number(googleAccount.expiryDate) : null
      );
    } catch (err: any) {
      console.error(`[Calendar Worker] ❌ Auth failed for ${hostUserId}:`, err.message);
      // Don't fall back to mock — surface the real error so the user knows to act
      return;
    }

    const calendar = google.calendar({ version: "v3", auth: authClient });

    // ── CREATE event ─────────────────────────────────────────────────────────
    if (action === "create-event") {
      try {
        const response = await calendar.events.insert({
          calendarId: "primary",
          conferenceDataVersion: settings.addMeetLink !== false ? 1 : 0,
          requestBody: {
            summary: `${booking.eventType.title} — ${booking.attendeeName}`,
            description: `Scheduled via Avora.\nGuest: ${booking.attendeeName} <${booking.attendeeEmail}>`,
            start: { dateTime: booking.startTime.toISOString() },
            end:   { dateTime: booking.endTime.toISOString() },
            attendees: [{ email: booking.attendeeEmail }],
            ...(settings.addMeetLink !== false
              ? {
                  conferenceData: {
                    createRequest: {
                      requestId: `avora-${bookingId}-${Date.now()}`,
                      conferenceSolutionKey: { type: "hangoutsMeet" },
                    },
                  },
                }
              : {}),
          },
        });

        const createdEventId = response.data.id;
        const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri;
        console.log(`[Calendar Worker] ✅ Event created in Google Calendar: ${createdEventId}${meetLink ? `, Meet: ${meetLink}` : ""}`);

        const existingFields = (booking.bookingFieldsData as Record<string, any>) ?? {};
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            bookingFieldsData: { ...existingFields, googleEventId: createdEventId, hangoutLink: meetLink },
          },
        });
      } catch (err: any) {
        console.error(`[Calendar Worker] ❌ Calendar insert failed for booking ${bookingId}:`, err.message);
      }
    }

    // ── DELETE event ─────────────────────────────────────────────────────────
    else if (action === "delete-event") {
      if (settings.deleteOnCancel === false) {
        console.log(`[Calendar Worker] deleteOnCancel disabled for ${hostUserId}. Skipping deletion.`);
        return;
      }

      const eventIdToDelete = googleEventId || (booking.bookingFieldsData as any)?.googleEventId;
      if (!eventIdToDelete) {
        console.log(`[Calendar Worker] No googleEventId for booking ${bookingId}, nothing to delete.`);
        return;
      }

      try {
        await calendar.events.delete({ calendarId: "primary", eventId: eventIdToDelete });
        console.log(`[Calendar Worker] ✅ Event ${eventIdToDelete} deleted from Google Calendar.`);
      } catch (err: any) {
        console.error(`[Calendar Worker] ❌ Calendar delete failed:`, err.message);
      }
    }
    
    // ── UPDATE event ─────────────────────────────────────────────────────────
    else if (action === "update-event") {
      const eventIdToUpdate = googleEventId || (booking.bookingFieldsData as any)?.googleEventId;
      if (!eventIdToUpdate) {
        console.log(`[Calendar Worker] No googleEventId for booking ${bookingId}, cannot update.`);
        return;
      }

      try {
        await calendar.events.patch({
          calendarId: "primary",
          eventId: eventIdToUpdate,
          requestBody: {
            start: { dateTime: booking.startTime.toISOString() },
            end:   { dateTime: booking.endTime.toISOString() },
          },
        });
        console.log(`[Calendar Worker] ✅ Event ${eventIdToUpdate} updated in Google Calendar.`);
      } catch (err: any) {
        console.error(`[Calendar Worker] ❌ Calendar update failed:`, err.message);
      }
    }
  },
  {
    connection: redisConnection,
    autorun: false,
  }
);

export default calendarWorker;
