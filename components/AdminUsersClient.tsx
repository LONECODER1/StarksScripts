"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
    Table, 
    TableHeader, 
    TableBody, 
    TableRow, 
    TableHead, 
    TableCell 
} from "@/components/ui/table";
import { 
    Shield, 
    User as UserIcon, 
    Search, 
    ShieldAlert, 
    ShieldCheck, 
    Loader2, 
    AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";

type SerializedUser = {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    createdAt: string;
};

interface AdminUsersClientProps {
    initialUsers: SerializedUser[];
    currentAdminEmail: string;
}

export default function AdminUsersClient({ initialUsers, currentAdminEmail }: AdminUsersClientProps) {
    const router = useRouter();
    const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const isPrimary = currentAdminEmail.toLowerCase() === "marstech.support@gmail.com";

    // Handle Search filter
    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    });

    const handleToggleRole = async (targetUser: SerializedUser) => {
        if (!isPrimary) return;

        // Prevent self-demotion or demoting the primary admin
        if (targetUser.email.toLowerCase() === "marstech.support@gmail.com") {
            setError("The primary administrator's clearance levels cannot be modified.");
            return;
        }

        setActionLoadingId(targetUser.id);
        setError(null);
        setSuccessMessage(null);

        const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";

        try {
            const res = await fetch(`/api/admin/users/${targetUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update user role");
            }

            // Update local state
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
            );

            setSuccessMessage(
                `Clearance level for ${targetUser.name} updated to ${newRole} successfully.`
            );
            
            // Refresh Server Component cache
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Security Clearance Alert for non-primary admins */}
            {!isPrimary && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs md:text-sm">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">READ-ONLY MODE:</span> You are authenticated as an administrator. However, only the primary administrator (<span className="font-mono">marstech.support@gmail.com</span>) can authorize new administrators or demote existing ones.
                    </div>
                </div>
            )}

            {/* Error/Success Feedbacks */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* User List Panel */}
            <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-amber-500" />
                
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
                    <div>
                        <CardTitle className="text-lg font-heading tracking-wide">OPERATIVE CLEARANCE REGISTRY</CardTitle>
                        <CardDescription className="text-xs font-mono">
                            Audit Stark operative clearance levels and manage admin privileges
                        </CardDescription>
                    </div>
                    
                    {/* Search Controls */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search operatives by name/email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/40">
                                    <TableHead className="w-12 text-center">ID</TableHead>
                                    <TableHead>Operative Info</TableHead>
                                    <TableHead>System Role</TableHead>
                                    <TableHead>Provision Date</TableHead>
                                    <TableHead className="text-right pr-6">Access Authorization</TableHead>
                                </TableRow>
                            </TableHeader>
                            
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-xs font-mono">
                                            No matching operatives found in registries.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isTargetPrimary = user.email.toLowerCase() === "marstech.support@gmail.com";
                                        const isAdmin = user.role === "ADMIN";

                                        return (
                                            <TableRow key={user.id} className="border-b border-border/20">
                                                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                                    {String(user.id).padStart(3, '0')}
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="font-heading font-semibold text-sm">{user.name}</div>
                                                    <div className="text-xs font-mono text-muted-foreground">{user.email}</div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    {isAdmin ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono">
                                                            <Shield className="w-2.5 h-2.5" />
                                                            {isTargetPrimary ? "PRIMARY_ADMIN" : "ADMINISTRATOR"}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-mono">
                                                            <UserIcon className="w-2.5 h-2.5" />
                                                            STANDARD_OPERATIVE
                                                        </span>
                                                    )}
                                                </TableCell>
                                                
                                                <TableCell className="text-xs font-mono text-muted-foreground">
                                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </TableCell>
                                                
                                                <TableCell className="text-right pr-6">
                                                    {isTargetPrimary ? (
                                                        <span className="text-[10px] font-mono text-muted-foreground italic px-3 py-1.5">
                                                            Database Owner
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant={isAdmin ? "destructive" : "default"}
                                                            disabled={!isPrimary || actionLoadingId === user.id}
                                                            onClick={() => handleToggleRole(user)}
                                                            className={cn(
                                                                "h-7 text-[10px] font-bold font-mono tracking-wider transition-all",
                                                                !isAdmin && isPrimary && "bg-amber-500 hover:bg-amber-600 text-background border-amber-500"
                                                            )}
                                                        >
                                                            {actionLoadingId === user.id ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                                            ) : isAdmin ? (
                                                                "REVOKE ADMIN"
                                                            ) : (
                                                                "PROMOTE ADMIN"
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
