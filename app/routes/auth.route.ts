import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
    console.log("Registration data received:", req.body);
    res.status(201).json({ message: "User registered successfully" });
});

export default router;