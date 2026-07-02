import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import nodemailer from "nodemailer";
import { z } from "zod";

const AlertSchema = z.object({
    title: z.string().min(1, "Subject is required").max(200),
    message: z.string().min(1, "Message body is required"),
});

export async function POST(req: NextRequest) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    try {
        const body = await req.json();
        const parsed = AlertSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, message } = parsed.data;

        // Fetch all users in the system
        const users = await prisma.user.findMany({
            select: {
                email: true,
                name: true,
            },
        });

        const activeUsers = users.filter((u) => u.email);

        if (activeUsers.length === 0) {
            return NextResponse.json({ message: "No active users to alert." });
        }

        // Configure nodemailer using environment variables
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const from = process.env.SMTP_FROM || `"StarkScripts Alerts" <${user}>`;

        if (!host || !port || !user || !pass) {
            return NextResponse.json(
                { error: "SMTP settings not fully configured in environment." },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });

        // Send emails
        let sentCount = 0;
        let failCount = 0;

        await Promise.all(
            activeUsers.map(async (u) => {
                try {
                    await transporter.sendMail({
                        from,
                        to: u.email,
                        subject: `[ALERT] ${title}`,
                        text: `Hello ${u.name},\n\nThis is an important broadcast from StarkScripts:\n\n${message}\n\nBest regards,\nStarkScripts Operations Team`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
                                <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 0;">StarkScripts System Alert</h2>
                                <p>Hello <strong>${u.name}</strong>,</p>
                                <p style="font-size: 1rem; line-height: 1.5; color: #1e293b; background-color: #f8fafc; padding: 15px; border-left: 4px solid #dc2626; border-radius: 4px;">
                                    ${message.replace(/\n/g, "<br />")}
                                </p>
                                <p style="font-size: 0.8rem; color: #64748b; margin-top: 20px;">
                                    This is a system broadcast. Do not reply to this email.
                                </p>
                            </div>
                        `,
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`Failed to send alert to ${u.email}:`, err);
                    failCount++;
                }
            })
        );

        return NextResponse.json({
            success: true,
            message: `Alert broadcast finished. Successfully sent to ${sentCount} users. (Failed: ${failCount})`,
            sentCount,
            failCount,
        });
    } catch (error) {
        console.error("Alert transmission failed:", error);
        return NextResponse.json({ error: "Failed to broadcast system alert." }, { status: 500 });
    }
}
