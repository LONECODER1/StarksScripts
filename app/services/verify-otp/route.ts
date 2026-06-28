import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import redisClient, { connectRedis } from "@/app/lib/redis";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({ error: "Missing email or OTP code" }, { status: 400 });
        }

        await connectRedis();
        const redisKey = `registration:${email}`;
        const storedData = await redisClient.get(redisKey);

        if (!storedData) {
            return NextResponse.json({
                error: "OTP has expired or email is incorrect. Please request a new one."
            }, { status: 400 });
        }

        const { fullname, password: hashedPassword, otp: storedOtp } = JSON.parse(storedData);

        if (otp !== storedOtp) {
            return NextResponse.json({ error: "Invalid OTP code. Please check and try again." }, { status: 400 });
        }

        // OTP is correct! Create user in database
        const user = await prisma.user.create({
            data: {
                name: fullname,
                email,
                password: hashedPassword,
            },
        });

        // Clean up Redis
        await redisClient.del(redisKey);

        return NextResponse.json({
            success: true,
            message: "Verification successful! User registered successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error in verify-otp:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
