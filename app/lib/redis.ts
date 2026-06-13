import { createClient } from "redis";

const client = createClient({
  username: process.env.REDIS_USERNAME ?? "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  if (client.isOpen) return;

  try {
    await client.connect();
    console.log("Redis connected successfully (used for OTP verification)");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Redis connection error:", message);
  }
};

export default client;
