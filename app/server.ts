import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import { connectDB } from './lib/db.js';
app.use(express.json());

connectDB();

// app.use('/register',authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});