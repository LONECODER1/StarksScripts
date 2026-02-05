import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URI;

const pool = new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully");
        client.release();
    }
    catch (err) {
        console.error("Database connection error:", err.message);
    }
};
export default pool;