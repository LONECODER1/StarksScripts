export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectRedis } = await import("./app/lib/redis");
    const { connectDB } = await import("./app/lib/db");
    await connectRedis();
    await connectDB();
  }
}
