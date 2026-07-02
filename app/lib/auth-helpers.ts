import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function getSessionUser() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    return user;
}

export async function requireAdminPage() {
    const user = await getSessionUser();
    if (!user) redirect("/login");
    if (user.role !== "ADMIN") redirect("/dashboard");
    return user;
}

export async function requireAdminApi() {
    const user = await getSessionUser();
    if (!user) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    if (user.role !== "ADMIN") {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { user };
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function isPrimaryAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    return email.toLowerCase() === "marstech.support@gmail.com";
}

