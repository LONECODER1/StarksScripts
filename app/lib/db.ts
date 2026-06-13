import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URI;
const useSSL = connectionString?.includes("sslmode=require") ?? true;

const pool = new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("Postgres connected successfully (used for authentication)");
        client.release();
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Database connection error:", message);
    }
};

export default pool;
