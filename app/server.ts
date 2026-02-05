import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import { connectDB } from './lib/db.js';
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});