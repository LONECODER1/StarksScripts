import "dotenv/config";
import express from "express";
import { connectDB } from "./lib/db.js";
import { connectRedis } from "./lib/redis.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();
connectRedis();

// app.use('/register',authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});