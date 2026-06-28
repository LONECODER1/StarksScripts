"use client";

import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CompanyShelf, { type CompanyData } from "@/components/CompanyShelf";
import StreakCalendar from "@/components/StreakCalendar";
import ProblemTable from "@/components/Table";

type ProblemItem = {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  acceptanceRate?: number;
  externalUrl?: string | null;
  tags?: { name: string }[];
  solved?: boolean;
};

interface ProblemsetShellProps {
  session: Parameters<typeof Header>[0]["session"];
  companies: CompanyData[];
  problems: ProblemItem[];
}

export default function ProblemsetShell({
  session,
  companies,
  problems,
}: ProblemsetShellProps) {
  return (
    <SidebarProvider className="[--sidebar-width:14rem]">
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <Header session={session} />

        <div className="flex w-full flex-1 gap-4 px-4 pb-4 pt-[72px]">
          <Sidebar />

          <main className="flex min-w-0 flex-1 flex-col gap-6 py-4">
            <div className="flex items-center gap-2 md:hidden">
              <SidebarTrigger className="border border-border text-foreground hover:bg-accent hover:text-accent-foreground" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                // Operations Menu
              </span>
            </div>

            <div className="w-full space-y-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                  System Coding Modules
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  // SECURITY AUTHENTICATION APPLIED // CHOOSE A TERMINAL INTERFACE
                </p>
              </div>

              <ProblemTable data={problems} />
            </div>
          </main>

          <aside className="sticky top-[88px] hidden h-[calc(100vh-88px-16px)] w-[280px] shrink-0 flex-col gap-4 self-start lg:flex">
            <div className="rounded-2xl border border-border bg-card/60 p-3 shadow-md backdrop-blur-md">
              <StreakCalendar />
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <CompanyShelf companies={companies} />
            </div>
          </aside>
        </div>
      </div>
    </SidebarProvider>
  );
}
