import prisma from "@/app/lib/prisma";
import AdminProblemsClient from "@/components/AdminProblemsClient";

export const dynamic = "force-dynamic";

export default async function AdminProblemsPage() {
    const problems = await prisma.problem.findMany({
        include: { tags: true },
        orderBy: { createdAt: "desc" },
    });

    const serialized = problems.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
    }));

    return <AdminProblemsClient initialProblems={serialized} />;
}
