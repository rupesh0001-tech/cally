import { emailWorker } from "./email.worker";
import { calendarWorker } from "./calendar.worker";
import { paymentWorker } from "./payment.worker";
import { analyticsWorker } from "./analytics.worker";
import { cronWorker, setupCronSchedules } from "./cron.worker";

export async function startWorkers() {
  console.log("⚙️ Starting background workers...");

  emailWorker.run();
  calendarWorker.run();
  paymentWorker.run();
  analyticsWorker.run();
  cronWorker.run();

  await setupCronSchedules();

  console.log("🚀 Background workers are active and listening to queues.");
}

export default startWorkers;
