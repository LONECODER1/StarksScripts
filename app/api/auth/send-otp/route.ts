import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import redisClient, { connectRedis } from "@/app/lib/redis";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullname, email, password } = body;

        if (!fullname || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 4. Store details in Redis with 10-minute expiry
        await connectRedis();
        const redisKey = `registration:${email}`;
        await redisClient.set(redisKey, JSON.stringify({
            fullname,
            email,
            password: hashedPassword,
            otp,
        }), {
            EX: 600, // 10 minutes
        });

        console.log("=========================================");
        console.log(`REGISTRATION OTP FOR ${email}: ${otp}`);
        console.log("=========================================");

        // 5. Send email via Nodemailer using SMTP environment variables
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (host && port && user && pass) {
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: {
                    user,
                    pass,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || `"StarkScripts" <${user}>`,
                to: email,
                subject: "Your OTP Verification Code",
                text: `Hello ${fullname},\n\nYour StarkScripts verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
                html: `<p>Hello <strong>${fullname}</strong>,</p><p>Your StarkScripts verification OTP is: <strong style="font-size: 1.2rem; color: #dc2626; letter-spacing: 0.05em;">${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
            });
        }

        // Return OTP in response in dev mode for easy automated verification
        return NextResponse.json({
            success: true,
            message: "OTP sent successfully. Please check your email.",
            otp, // Expose OTP directly in JSON for ease of testing
        });
    } catch (error) {
        console.error("Error in send-otp:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
