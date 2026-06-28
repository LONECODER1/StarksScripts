import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, slugify } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

const CreateProblemSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required"),
    difficlty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
    points: z.coerce.number().int().min(1).max(1000).default(10),
    externalUrl: z.string().url().optional().or(z.literal("")),
    acceptanceRate: z.coerce.number().min(0).max(100).default(0),
    tags: z.array(z.string()).optional().default([]),
});

async function connectTags(tagNames: string[]) {
    const uniqueTags = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
    return uniqueTags.map((name) => ({
        where: { slug: slugify(name) },
        create: { name, slug: slugify(name) },
    }));
}

export async function GET() {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    const problems = await prisma.problem.findMany({
        include: { tags: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(problems);
}

export async function POST(req: NextRequest) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    try {
        const body = await req.json();
        const parsed = CreateProblemSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, description, difficlty, points, externalUrl, acceptanceRate, tags } =
            parsed.data;

        let slug = slugify(title);
        const existingSlug = await prisma.problem.findUnique({ where: { slug } });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        const tagConnectors = await connectTags(tags);

        const problem = await prisma.problem.create({
            data: {
                title,
                slug,
                description,
                difficlty,
                points,
                externalUrl: externalUrl || null,
                acceptanceRate,
                tags: {
                    connectOrCreate: tagConnectors,
                },
            },
            include: { tags: true },
        });

        return NextResponse.json(problem, { status: 201 });
    } catch (error) {
        console.error("Failed to create problem:", error);
        return NextResponse.json({ error: "Failed to create problem" }, { status: 500 });
    }
}
