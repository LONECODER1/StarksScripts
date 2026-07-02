import { notFound } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import Header from '@/components/Header';
import { auth } from '@/app/lib/auth';
import Workspace from '@/components/Workspace/Workspace';

export const dynamic = "force-dynamic";

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();
    const { slug } = await params;

    const problem = await prisma.problem.findUnique({
        where: { slug },
        include: {
            testCases: true,
            codeSnippets: true,
            tags: true,
        }
    });

    if (!problem) {
        notFound();
    }

    // Serialize all Date objects so they can be safely passed to client components
    const serializedProblem = {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        description: problem.description,
        difficlty: problem.difficlty,
        points: problem.points,
        acceptanceRate: problem.acceptanceRate,
        externalUrl: problem.externalUrl,
        tags: problem.tags,
    };

    const serializedTestCases = problem.testCases.map((tc) => ({
        id: tc.id,
        input: tc.input,
        output: tc.output,
        isSample: tc.isSample,
    }));

    const serializedSnippets = problem.codeSnippets.map((cs) => ({
        id: cs.id,
        language: cs.language,
        code: cs.code,
    }));

    return (
        <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Header session={session} />
            <main style={{ height: 'calc(100vh - 72px)', marginTop: '72px', overflow: 'hidden', flexShrink: 0 }}>
                <Workspace
                    problem={serializedProblem}
                    testCases={serializedTestCases}
                    codeSnippets={serializedSnippets}
                />
            </main>
        </div>
    );
}
