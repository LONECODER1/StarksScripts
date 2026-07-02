import Header from '@/components/Header';
import { auth } from '@/app/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import CompanyShelf from '@/components/CompanyShelf';
import Calendar from '@/components/Calendar';
import Noticeboard from '@/components/Noticeboard';
import prisma from '@/app/lib/prisma';
import { getCompaniesForProblemset } from '@/app/lib/problems';

export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const session = await auth();

    const [companies, notifications] = await Promise.all([
        getCompaniesForProblemset(),
        prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
        }).catch(() => []),
    ]);

    const notices = notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
    }));

    return (
        <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
                <Header session={session} />

                <div className="flex flex-1 relative pt-[72px]">
                    <Sidebar />

                    <main className="flex-1 min-w-0 px-4 py-4 md:pl-[256px] lg:pr-[328px] flex flex-col gap-6">
                        <div className="flex items-center gap-2 md:hidden">
                            <SidebarTrigger className="border border-border hover:bg-accent hover:text-accent-foreground text-foreground" />
                            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                                // Operations Menu
                            </span>
                        </div>

                        <Noticeboard notices={notices} />
                    </main>

                    <div className="!fixed !top-[88px] !right-4 !h-[calc(100vh-88px-16px)] w-[280px] hidden lg:flex flex-col gap-4">
                        <div className="border border-border bg-card/60 backdrop-blur-md rounded-2xl p-2.5 shadow-md flex items-center justify-center">
                            <Calendar mode="single" className="w-full text-foreground" />
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col">
                            <CompanyShelf companies={companies} />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
