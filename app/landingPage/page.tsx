import Header from '@/components/Header';
import { auth } from '@/app/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import CompanyShelf from '@/components/CompanyShelf';
import Calendar from '@/components/Calendar';
import ProblemTable from '@/components/Table';
import prisma from '@/app/lib/prisma';

export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const session = await auth();

    // Query companies from database with problem counts
    const dbCompanies = await prisma.company.findMany({
        include: {
            _count: {
                select: { companyProblems: true }
            }
        }
    }).catch(() => []);

    // Format company data for shelf component
    let companies = dbCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        count: c._count.companyProblems,
    }));

    // Fallback list of top tech companies from the design image if DB is empty
    if (companies.length === 0) {
        const mockData = [
            { name: "Expedia", count: 64 },
            { name: "Yahoo", count: 34 },
            { name: "Anduril", count: 56 },
            { name: "Snap", count: 84 },
            { name: "Coupang", count: 47 },
            { name: "ServiceNow", count: 72 },
            { name: "Atlassian", count: 62 },
            { name: "Rippling", count: 23 },
            { name: "Jane Street", count: 14 },
            { name: "Qualcomm", count: 62 },
            { name: "Intuit", count: 66 },
            { name: "Agoda", count: 45 },
            { name: "Deloitte", count: 43 },
            { name: "PayPal", count: 104 },
            { name: "Docusign", count: 36 },
            { name: "Palo Alto Networks", count: 46 },
            { name: "Samsung", count: 63 },
            { name: "Morgan Stanley", count: 60 },
            { name: "Flipkart", count: 105 },
            { name: "SAP", count: 42 }
        ];
        companies = mockData.map((item, idx) => ({
            id: String(idx + 1),
            name: item.name,
            count: item.count,
        }));
    }

    // Query problems from database
    const dbProblems = await prisma.problem.findMany({
        take: 15,
        include: {
            tags: true,
        }
    }).catch(() => []);

    // Format problem data for UI
    let problems = dbProblems.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficlty as "Easy" | "Medium" | "Hard",
        points: p.points,
        acceptanceRate: p.acceptanceRate,
        externalUrl: p.externalUrl,
        tags: p.tags?.map(t => ({ name: t.name })),
        solved: Math.random() > 0.4, // Mock solved status for UI polish
    }));

    // Fallback Stark-themed problems list if DB is unpopulated
    if (problems.length === 0) {
        problems = [
            { id: "1846", title: "Maximum Element After Decreasing and Rearranging", slug: "maximum-element-after-decreasing-and-rearranging", difficulty: "Medium", points: 100, acceptanceRate: 68.1, solved: false, tags: [{ name: "Array" }, { name: "Greedy" }], externalUrl: null },
            { id: "1", title: "Two Sum", slug: "two-sum", difficulty: "Easy", points: 20, acceptanceRate: 57.7, solved: true, tags: [{ name: "Array" }, { name: "Hash Table" }], externalUrl: null },
            { id: "2", title: "Add Two Numbers", slug: "add-two-numbers", difficulty: "Medium", points: 50, acceptanceRate: 48.7, solved: true, tags: [{ name: "Linked List" }, { name: "Math" }], externalUrl: null },
            { id: "3", title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", points: 50, acceptanceRate: 39.3, solved: true, tags: [{ name: "Hash Table" }, { name: "String" }], externalUrl: null },
            { id: "4", title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", points: 100, acceptanceRate: 46.9, solved: true, tags: [{ name: "Array" }, { name: "Binary Search" }], externalUrl: null },
            { id: "5", title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", points: 50, acceptanceRate: 38.1, solved: false, tags: [{ name: "String" }, { name: "Dynamic Programming" }], externalUrl: null },
        ];
    }

    return (
        <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
                {/* Header spans the full width of the page */}
                <Header session={session} />
                
                {/* Three-column layout below header */}
                <div className="flex flex-1 relative pt-[72px]">
                    {/* Left Sidebar */}
                    <Sidebar />
                    
                    {/* Center main content (Problems list) */}
                    <main className="flex-1 min-w-0 px-4 py-4 md:pl-[256px] lg:pr-[328px] flex flex-col gap-6">
                        {/* Mobile trigger button for sidebar */}
                        <div className="flex items-center gap-2 md:hidden">
                            <SidebarTrigger className="border border-border hover:bg-accent hover:text-accent-foreground text-foreground" />
                            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">// Operations Menu</span>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <h2 className="text-xl font-heading font-bold tracking-wider text-foreground uppercase">
                                    System Coding Modules
                                </h2>
                                <p className="text-xs text-muted-foreground font-mono">
                                    // SECURITY AUTHENTICATION APPLIED // CHOOSE A TERMINAL INTERFACE
                                </p>
                            </div>

                            {/* LeetCode Style Problem List Table */}
                            <ProblemTable data={problems} />
                        </div>
                    </main>

                    {/* Right Column: Calendar + Company Shelf (Desktop Only) */}
                    <div className="!fixed !top-[88px] !right-4 !h-[calc(100vh-88px-16px)] w-[280px] hidden lg:flex flex-col gap-4">
                        {/* Calendar component wrapper */}
                        <div className="border border-border bg-card/60 backdrop-blur-md rounded-2xl p-2.5 shadow-md flex items-center justify-center">
                            <Calendar mode="single" className="w-full text-foreground" />
                        </div>
                        
                        {/* Company Shelf component wrapper */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <CompanyShelf companies={companies} />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
