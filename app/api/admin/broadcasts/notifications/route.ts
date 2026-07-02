import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

const NotificationSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    message: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    try {
        const body = await req.json();
        const parsed = NotificationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, message } = parsed.data;

        const notification = await prisma.notification.create({
            data: { title, message },
        });

        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        console.error("Failed to create notification:", error);
        return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
