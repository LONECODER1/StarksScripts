import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, context: RouteContext) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    const { id } = await context.params;

    try {
        const existing = await prisma.notification.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        await prisma.notification.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }
}
