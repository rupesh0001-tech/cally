import Redis from "ioredis";
import { env } from "./config/env";
import { startWorkers } from "./workers";

async function main() {
  console.log("🔍 Checking Redis connection...");

  const testRedis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 0,
    connectTimeout: 2000,
  });

  // Silence unhandled error warnings on stderr
  testRedis.on("error", () => {});

  try {
    await new Promise<void>((resolve, reject) => {
      testRedis.once("connect", () => {
        testRedis.disconnect();
        resolve();
      });
      testRedis.once("error", (err) => {
        testRedis.disconnect();
        reject(err);
      });
    });
    console.log("✅ Redis connection successful.");
  } catch (err) {
    console.error(`
❌ FATAL ERROR: Could not connect to Redis at ${env.REDIS_URL}.
👉 Please make sure Redis is installed and running on your system.
   On Mac (Homebrew): run 'brew services start redis'
   Or start it manually: run 'redis-server' in another terminal window.
`);
    process.exit(1);
  }

  await startWorkers();
}

main().catch((err) => {
  console.error("FATAL: Worker startup failed:", err);
  process.exit(1);
});