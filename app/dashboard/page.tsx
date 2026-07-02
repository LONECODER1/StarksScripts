import Header from "@/components/Header";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield, User as UserIcon, Code, Users, Calendar, Radio, Activity, Award, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    // Retrieve user data from database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email as string }
    });

    const name = user?.name || session.user.name || "Stark User";
    const email = user?.email || session.user.email || "";
    const role = user?.role || "USER";
    const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : "June 27, 2026"; // Fallback to current mock date

    // Query stats from database
    const totalUsers = await prisma.user.count().catch(() => 1); // fallback if error
    const totalProblems = await prisma.problem.count().catch(() => 0);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            {/* Header integration */}
            <Header session={session} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
                {/* Observability Platform Header */}
                <div className="border border-border bg-card/40 backdrop-blur-md rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-primary uppercase">
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            Stark Observability // SECURE ACCESS GRANTED
                        </div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-secondary">{name}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xl">
                            All systems operational. Your credentials have been authorized via the Arc Reactor security gateway.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-muted/50 border border-border px-4 py-2 rounded-lg text-xs font-mono text-muted-foreground self-stretch md:self-auto justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                        <span>SESSION EXPIRY: 30d</span>
                    </div>
                </div>

                {/* Dashboard Core Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1: Profile Summary */}
                    <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-primary to-secondary" />
                        
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-lg font-heading tracking-wider text-muted-foreground uppercase">
                                OPERATIVE ID
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                            {/* Profile Image with Dynamic Status Ring */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-28 h-28 rounded-full border-4 border-green-500 flex items-center justify-center bg-muted overflow-hidden shadow-lg shadow-green-500/10">
                                    {session.user.image ? (
                                        <img 
                                            src={session.user.image} 
                                            alt={name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-14 h-14 text-muted-foreground" />
                                    )}
                                </div>
                                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
                            </div>

                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-heading font-bold">{name}</h2>
                                <p className="text-sm text-muted-foreground font-mono">{email}</p>
                            </div>

                            <div className="w-full border-t border-border/60 my-2" />

                            <div className="w-full space-y-4 font-mono text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">ACCESS CLEARANCE</span>
                                    {role === "ADMIN" ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500">
                                            <Shield className="w-3 h-3" />
                                            ADMINISTRATOR
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-primary">
                                            <UserIcon className="w-3 h-3" />
                                            STANDARD USER
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">PROVISION DATE</span>
                                    <span className="text-foreground flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                        {createdAt}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">SECURE KEY</span>
                                    <span className="text-foreground text-[10px] bg-muted px-2 py-0.5 rounded select-all font-mono">
                                        USR-{user?.id || session.user.id || "00"}-{role}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Column 2: Platform Analytics & Arc Reactor Core */}
                    <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-secondary via-amber-400 to-red-500" />
                        
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-heading tracking-wider text-muted-foreground uppercase">
                                ARC REACTOR STATUS
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col justify-between p-6 gap-6">
                            {/* Arc Reactor Spinning Core Visual */}
                            <div className="relative w-36 h-36 mx-auto flex items-center justify-center bg-black/40 rounded-full border border-border overflow-hidden shadow-inner my-2">
                                {/* Core glow */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary-foreground)_0%,transparent_70%)] animate-pulse opacity-20" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] animate-pulse opacity-15" />
                                
                                {/* Spinning ring 1 */}
                                <div className="absolute w-28 h-28 border-2 border-dashed border-primary/40 rounded-full animate-[spin_12s_linear_infinite]" />
                                {/* Spinning ring 2 */}
                                <div className="absolute w-24 h-24 border border-dotted border-secondary/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                                {/* Spinning ring 3 */}
                                <div className="absolute w-20 h-20 border border-dashed border-red-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
                                
                                {/* Center element */}
                                <div className="absolute w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/50">
                                    <Activity className="w-6 h-6 text-white animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-4 font-mono text-xs mt-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/40 p-3 rounded-lg border border-border/40 text-center">
                                        <div className="text-muted-foreground mb-1 text-[10px]">OPERATIVES</div>
                                        <div className="text-lg font-bold flex items-center justify-center gap-1.5">
                                            <Users className="w-4 h-4 text-primary" />
                                            {totalUsers}
                                        </div>
                                    </div>
                                    <div className="bg-muted/40 p-3 rounded-lg border border-border/40 text-center">
                                        <div className="text-muted-foreground mb-1 text-[10px]">SCRIPTS</div>
                                        <div className="text-lg font-bold flex items-center justify-center gap-1.5">
                                            <Code className="w-4 h-4 text-secondary" />
                                            {totalProblems}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-muted/30 border border-border/60 p-2.5 rounded-lg text-[10px]">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                        CORE STABILITY
                                    </span>
                                    <span className="text-green-500 font-bold">100.0% OPTIMAL</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Column 3: Operational Directives */}
                    <Card className="border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-red-500 to-primary" />
                        
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-heading tracking-wider text-muted-foreground uppercase">
                                OPERATIONAL DIRECTIVES
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col justify-between p-6 gap-6">
                            <div className="space-y-4">
                                {role === "ADMIN" ? (
                                    /* Admin Directive List */
                                    <>
                                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">
                                            // ADMINISTRATIVE PRIVILEGES ACTIVE
                                        </p>
                                        <div className="space-y-3">
                                            <Link
                                                href="/admin/users"
                                                className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors"
                                            >
                                                <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold font-heading">OPERATIVE MANAGER</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">Control permission levels & audit log files.</div>
                                                </div>
                                            </Link>
                                            <Link
                                                href="/admin/problems"
                                                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                                            >
                                                <Code className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold font-heading">SCRIPT EDITOR</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">Add, edit, or remove coding challenges.</div>
                                                </div>
                                            </Link>
                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold font-heading">SECURITY LOGS</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">View threat intelligence anomalies.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Standard User Directive List */
                                    <>
                                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">
                                            // PLATFORM ENGAGEMENT METRIC
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer">
                                                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold font-heading">DAILY SCRIPT CHALLENGE</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">Solve today's puzzle to maintain streak.</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors cursor-pointer">
                                                <Code className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold font-heading">MOCK INTERVIEW REHEARSAL</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">Train against Stark AI interview core.</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 hover:bg-muted/60 transition-colors cursor-pointer">
                                                <Users className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold font-heading">STARK DISCUSSION FORUMS</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">Share solutions & request debugging aid.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-auto border-t border-border/60 pt-4 flex gap-2">
                                <button className="flex-1 font-heading text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground border border-primary p-2.5 rounded hover:bg-transparent hover:text-primary transition-all">
                                    INITIALIZE CONSOLE
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}