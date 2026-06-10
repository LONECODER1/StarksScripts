export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectRedis } = await import("./lib/redis");
    await connectRedis();
  }
}
