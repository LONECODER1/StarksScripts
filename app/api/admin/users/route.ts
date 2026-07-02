import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";

export async function GET() {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
