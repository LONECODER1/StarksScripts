import prisma from "@/app/lib/prisma";
import { requireAdminPage } from "@/app/lib/auth-helpers";
import AdminBroadcastsClient from "@/components/AdminBroadcastsClient";

export const dynamic = "force-dynamic";

export default async function AdminBroadcastsPage() {
    await requireAdminPage();

    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
    });

    const serializedNotifications = notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
    }));

    return <AdminBroadcastsClient initialNotifications={serializedNotifications} />;
}
