import prisma from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { requireAdminPage } from "@/app/lib/auth-helpers";
import AdminUsersClient from "@/components/AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    await requireAdminPage();
    const session = await auth();
    const sessionUserEmail = session?.user?.email || "";

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    const serializedUsers = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
    }));

    return (
        <AdminUsersClient 
            initialUsers={serializedUsers} 
            currentAdminEmail={sessionUserEmail} 
        />
    );
}
