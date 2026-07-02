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
    Radio, 
    Mail, 
    Send, 
    BellRing, 
    Trash2, 
    Loader2, 
    AlertTriangle, 
    CheckCircle2 
} from "lucide-react";

type SerializedNotification = {
    id: string;
    title: string;
    message: string;
    createdAt: string;
};

interface AdminBroadcastsClientProps {
    initialNotifications: SerializedNotification[];
}

export default function AdminBroadcastsClient({ initialNotifications }: AdminBroadcastsClientProps) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<SerializedNotification[]>(initialNotifications);

    // Form states - Email Alert
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

    // Form states - Noticeboard Notification
    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeMessage, setNoticeMessage] = useState("");
    const [noticeLoading, setNoticeLoading] = useState(false);
    const [noticeError, setNoticeError] = useState<string | null>(null);
    const [noticeSuccess, setNoticeSuccess] = useState<string | null>(null);

    // Deleting state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Handlers
    const handleSendEmailAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailLoading(true);
        setEmailError(null);
        setEmailSuccess(null);

        try {
            const res = await fetch("/api/admin/broadcasts/alerts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: emailSubject, message: emailMessage }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to broadcast email alert");
            }

            setEmailSuccess(data.message || "Email alert broadcast successfully.");
            setEmailSubject("");
            setEmailMessage("");
        } catch (err) {
            setEmailError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setEmailLoading(false);
        }
    };

    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        setNoticeLoading(true);
        setNoticeError(null);
        setNoticeSuccess(null);

        try {
            const res = await fetch("/api/admin/broadcasts/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: noticeTitle, message: noticeMessage }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create notification");
            }

            setNoticeSuccess("Notice posted on landing page successfully.");
            setNoticeTitle("");
            setNoticeMessage("");
            
            // Update local state
            setNotifications((prev) => [data, ...prev]);
            router.refresh();
        } catch (err) {
            setNoticeError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setNoticeLoading(false);
        }
    };

    const handleDeleteNotice = async (id: string) => {
        if (!confirm("Revoke this notice? It will disappear from the landing page noticeboard.")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/broadcasts/notifications/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete notification");
            }

            setNotifications((prev) => prev.filter((n) => n.id !== id));
            router.refresh();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Network error. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            
            {/* Left Column: Form Editors */}
            <div className="space-y-6">
                
                {/* Email Alert Section */}
                <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-red-500 to-amber-500" />
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-md font-heading font-bold flex items-center gap-2 text-red-500">
                            <Mail className="w-4 h-4" />
                            EMAIL BROADCAST ALERT
                        </CardTitle>
                        <CardDescription className="text-xs font-mono">
                            Sends an immediate broadcast email alert to all registered operatives
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                        <form onSubmit={handleSendEmailAlert} className="space-y-4">
                            {emailError && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span>{emailError}</span>
                                </div>
                            )}
                            {emailSuccess && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{emailSuccess}</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    Email Subject *
                                </label>
                                <Input
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="System Maintenance Schedule"
                                    required
                                    className="text-xs h-9"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    Message Body *
                                </label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    placeholder="Operatives, the system console will undergo maintenance..."
                                    required
                                    rows={4}
                                    className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 resize-y min-h-[90px]"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={emailLoading} 
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider uppercase h-9"
                            >
                                {emailLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                ) : (
                                    <Send className="w-3.5 h-3.5 mr-1.5" />
                                )}
                                TRANSMIT EMAIL ALERT
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Landing Page Notification Section */}
                <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-secondary" />
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-md font-heading font-bold flex items-center gap-2 text-primary">
                            <BellRing className="w-4 h-4" />
                            LANDING PAGE NOTICEBOARD
                        </CardTitle>
                        <CardDescription className="text-xs font-mono">
                            Post notifications to be displayed on the noticeboard of the main landing page
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            {noticeError && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span>{noticeError}</span>
                                </div>
                            )}
                            {noticeSuccess && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{noticeSuccess}</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    Notice Title *
                                </label>
                                <Input
                                    value={noticeTitle}
                                    onChange={(e) => setNoticeTitle(e.target.value)}
                                    placeholder="New Challenges Released"
                                    required
                                    className="text-xs h-9"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    Notice Description *
                                </label>
                                <textarea
                                    value={noticeMessage}
                                    onChange={(e) => setNoticeMessage(e.target.value)}
                                    placeholder="We have added 5 new React and Python challenges. Maintain your streaks!"
                                    required
                                    rows={4}
                                    className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 resize-y min-h-[90px]"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={noticeLoading} 
                                className="w-full bg-primary hover:bg-primary/80 font-mono text-xs font-bold tracking-wider uppercase h-9"
                            >
                                {noticeLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                ) : (
                                    <Radio className="w-3.5 h-3.5 mr-1.5" />
                                )}
                                PUBLISH NOTICEBOARD POST
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Live Notice Registry */}
            <div>
                <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-500 to-primary" />
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-md font-heading font-bold flex items-center gap-2">
                            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
                            ACTIVE BROADCAST REGISTRY
                        </CardTitle>
                        <CardDescription className="text-xs font-mono">
                            Manage all active noticeboard posts currently shown on the landing page
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border/40">
                                        <th className="text-left px-4 py-3 font-mono text-xs uppercase text-muted-foreground w-1/3">Notice</th>
                                        <th className="text-left px-4 py-3 font-mono text-xs uppercase text-muted-foreground w-1/2">Description</th>
                                        <th className="text-right px-4 py-3 font-mono text-xs uppercase text-muted-foreground w-1/6">Actions</th>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notifications.length === 0 ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={3} className="h-48 text-center text-muted-foreground text-xs font-mono">
                                                No active broadcasts posted.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        notifications.map((n) => (
                                            <TableRow key={n.id} className="border-b border-border/20">
                                                <TableCell className="px-4 py-3">
                                                    <div className="font-heading font-bold text-sm text-foreground">{n.title}</div>
                                                    <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                                                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-xs text-muted-foreground line-clamp-3">
                                                    {n.message}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleDeleteNotice(n.id)}
                                                        disabled={deletingId === n.id}
                                                        title="Revoke Notice"
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        {deletingId === n.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
