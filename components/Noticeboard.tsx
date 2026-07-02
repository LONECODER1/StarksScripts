"use client";

import { Megaphone, Calendar } from "lucide-react";

export type NoticeItem = {
    id: string;
    title: string;
    message: string;
    createdAt: string;
};

interface NoticeboardProps {
    notices: NoticeItem[];
}

export default function Noticeboard({ notices }: NoticeboardProps) {
    return (
        <div className="space-y-6 w-full flex flex-col items-center font-sans">
            {/* Header/Title Card */}
            <div className="border border-border bg-card/40 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden text-center shadow-lg shadow-black/10 w-full">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-amber-500" />
                
                <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-amber-500 uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    SYSTEM OPERATIONS BROADCASTS
                </div>
                
                <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wider text-foreground uppercase">
                    Noticeboard
                </h1>
                
                <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-wider">
                    // Platform Alerts & Directives Archive //
                </p>
            </div>

            {/* Notifications Feed */}
            <div className="space-y-4 w-full flex flex-col items-center">
                {notices.length > 0 ? (
                    notices.map((notice) => (
                        <div 
                            key={notice.id} 
                            className="border border-border bg-card/30 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:border-border/80 shadow-md flex flex-col items-center text-center gap-3 w-full"
                        >
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/60 to-amber-500/60" />
                            
                            <div className="flex flex-col items-center gap-1.5">
                                <h3 className="text-base md:text-lg font-heading font-bold text-foreground tracking-wide uppercase">
                                    {notice.title}
                                </h3>
                                
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/80 bg-muted/40 border border-border/40 px-2 py-0.5 rounded-full">
                                    <Calendar className="w-3 h-3 text-amber-500" />
                                    {new Date(notice.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-4xl whitespace-pre-wrap text-center font-sans mt-1">
                                {notice.message}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="border border-dashed border-border bg-card/20 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 w-full">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 border border-border">
                            <Megaphone className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-heading font-semibold text-foreground">
                            No Active Announcements
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono max-w-sm">
                            System logs are clear. Check back later for platform updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
