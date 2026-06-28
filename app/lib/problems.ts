import prisma from "@/app/lib/prisma";

export type ProblemListItem = {
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

export async function getProblemsForProblemset(userId?: number): Promise<ProblemListItem[]> {
    const dbProblems = await prisma.problem.findMany({
        include: { tags: true },
        orderBy: { createdAt: "desc" },
    });

    let solvedIds = new Set<string>();
    if (userId) {
        const submissions = await prisma.submission.findMany({
            where: { userId, status: "ACCEPTED" },
            select: { problemId: true },
            distinct: ["problemId"],
        });
        solvedIds = new Set(submissions.map((s) => s.problemId));
    }

    return dbProblems.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficlty as "Easy" | "Medium" | "Hard",
        points: p.points,
        acceptanceRate: p.acceptanceRate,
        externalUrl: p.externalUrl,
        tags: p.tags.map((t) => ({ name: t.name })),
        solved: solvedIds.has(p.id),
    }));
}

export async function getCompaniesForProblemset() {
    const dbCompanies = await prisma.company.findMany({
        include: {
            _count: { select: { companyProblems: true } },
        },
        orderBy: { name: "asc" },
    });

    return dbCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        count: c._count.companyProblems,
    }));
}
