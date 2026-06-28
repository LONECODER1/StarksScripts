import { auth } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import ProblemsetShell from '@/components/ProblemsetShell';
import { getCompaniesForProblemset, getProblemsForProblemset } from '@/app/lib/problems';

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
    const session = await auth();

    const userId = session?.user?.email
        ? (await prisma.user.findUnique({
              where: { email: session.user.email },
              select: { id: true },
          }))?.id
        : undefined;

    const [companies, problems] = await Promise.all([
        getCompaniesForProblemset(),
        getProblemsForProblemset(userId),
    ]);

    return (
        <ProblemsetShell
            session={session}
            companies={companies}
            problems={problems}
        />
    );
}
