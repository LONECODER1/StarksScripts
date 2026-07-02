import Header from "@/components/Header";
import { auth } from "@/app/lib/auth";
import { requireAdminPage } from "@/app/lib/auth-helpers";
import Link from "next/link";
import { Shield, Code, ArrowLeft } from "lucide-react";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdminPage();
    const session = await auth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Header session={session} />

            <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-500 uppercase">
                            <Shield className="w-3.5 h-3.5" />
                            Admin Panel
                        </div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight flex items-center gap-2">
                            <Shield className="w-7 h-7 text-primary" />
                            Admin Operations
                        </h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            Manage coding challenges, system permissions, and audit parameters
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Dashboard
                    </Link>
                </div>

                <AdminNav />

                {children}
            </div>
        </div>
    );
}
