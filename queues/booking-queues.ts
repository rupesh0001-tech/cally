import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5000,
  },
  removeOnComplete: true,
  removeOnFail: false,
};

export const emailQueue = new Queue("email", {
  connection: redisConnection,
  defaultJobOptions,
});

export const calendarQueue = new Queue("calendar", {
  connection: redisConnection,
  defaultJobOptions,
});

export const paymentQueue = new Queue("payment", {
  connection: redisConnection,
  defaultJobOptions,
});

export const analyticsQueue = new Queue("analytics", {
  connection: redisConnection,
  defaultJobOptions,
});
