"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Users, Radio } from "lucide-react";

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <div className="flex gap-2 border-b border-border/60 mb-6 font-sans">
            <Link
                href="/admin/problems"
                className={`flex items-center gap-2 pb-2.5 px-4 text-sm font-heading font-semibold border-b-2 transition-all duration-200 ${
                    pathname?.startsWith("/admin/problems")
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
                <Code2 className="w-4 h-4" />
                Challenges
            </Link>
            <Link
                href="/admin/users"
                className={`flex items-center gap-2 pb-2.5 px-4 text-sm font-heading font-semibold border-b-2 transition-all duration-200 ${
                    pathname?.startsWith("/admin/users")
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
                <Users className="w-4 h-4" />
                Operatives Clearance
            </Link>
            <Link
                href="/admin/broadcasts"
                className={`flex items-center gap-2 pb-2.5 px-4 text-sm font-heading font-semibold border-b-2 transition-all duration-200 ${
                    pathname?.startsWith("/admin/broadcasts")
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
                <Radio className="w-4 h-4" />
                System Broadcasts
            </Link>
        </div>
    );
}
