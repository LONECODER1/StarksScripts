import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, isPrimaryAdmin } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

const UpdateUserSchema = z.object({
    role: z.enum(["USER", "ADMIN"]),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, context: RouteContext) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    const { user: currentAdmin } = authResult;
    const { id } = await context.params;

    // SECURITY CHECK: Only the primary admin (marstech.support@gmail.com) is allowed to change roles.
    if (!isPrimaryAdmin(currentAdmin.email)) {
        return NextResponse.json(
            { error: "Forbidden: Only the primary administrator (marstech.support@gmail.com) can modify user clearance levels." },
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const parsed = UpdateUserSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const targetUserId = parseInt(id);
        if (isNaN(targetUserId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prevent primary admin from demoting themselves to maintain database ownership sanity!
        if (isPrimaryAdmin(targetUser.email) && parsed.data.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden: The primary administrator's clearance cannot be revoked." },
                { status: 403 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                role: parsed.data.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user role:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}
