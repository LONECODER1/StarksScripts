import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, slugify } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

const UpdateProblemSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    difficlty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    points: z.coerce.number().int().min(1).max(1000).optional(),
    externalUrl: z.string().url().optional().or(z.literal("")).nullable(),
    acceptanceRate: z.coerce.number().min(0).max(100).optional(),
    tags: z.array(z.string()).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    const { id } = await context.params;

    try {
        const body = await req.json();
        const parsed = UpdateProblemSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const existing = await prisma.problem.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const { title, description, difficlty, points, externalUrl, acceptanceRate, tags } =
            parsed.data;

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) {
            updateData.title = title;
            updateData.slug = slugify(title);
        }
        if (description !== undefined) updateData.description = description;
        if (difficlty !== undefined) updateData.difficlty = difficlty;
        if (points !== undefined) updateData.points = points;
        if (externalUrl !== undefined) updateData.externalUrl = externalUrl || null;
        if (acceptanceRate !== undefined) updateData.acceptanceRate = acceptanceRate;

        if (tags !== undefined) {
            const uniqueTags = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
            const tagRecords = await Promise.all(
                uniqueTags.map((name) =>
                    prisma.tag.upsert({
                        where: { slug: slugify(name) },
                        create: { name, slug: slugify(name) },
                        update: {},
                    })
                )
            );

            await prisma.problem.update({
                where: { id },
                data: {
                    tags: { set: tagRecords.map((t) => ({ id: t.id })) },
                },
            });
        }

        const problem = await prisma.problem.update({
            where: { id },
            data: updateData,
            include: { tags: true },
        });

        return NextResponse.json(problem);
    } catch (error) {
        console.error("Failed to update problem:", error);
        return NextResponse.json({ error: "Failed to update problem" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
    const authResult = await requireAdminApi();
    if ("error" in authResult) return authResult.error;

    const { id } = await context.params;

    try {
        const existing = await prisma.problem.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        await prisma.problem.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete problem:", error);
        return NextResponse.json({ error: "Failed to delete problem" }, { status: 500 });
    }
}
