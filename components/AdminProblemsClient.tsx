"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Problem = {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficlty: "Easy" | "Medium" | "Hard";
    points: number;
    acceptanceRate: number;
    externalUrl: string | null;
    tags: { id: string; name: string }[];
    createdAt: string;
};

type FormData = {
    title: string;
    description: string;
    difficlty: "Easy" | "Medium" | "Hard";
    points: number;
    acceptanceRate: number;
    externalUrl: string;
    tags: string;
};

const emptyForm: FormData = {
    title: "",
    description: "",
    difficlty: "Easy",
    points: 10,
    acceptanceRate: 0,
    externalUrl: "",
    tags: "",
};

const difficultyColors = {
    Easy: "text-green-500 bg-green-500/10 border-green-500/30",
    Medium: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    Hard: "text-red-500 bg-red-500/10 border-red-500/30",
};

interface AdminProblemsClientProps {
    initialProblems: Problem[];
}

export default function AdminProblemsClient({ initialProblems }: AdminProblemsClientProps) {
    const router = useRouter();
    const [problems, setProblems] = useState(initialProblems);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const openCreateForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError(null);
        setShowForm(true);
    };

    const openEditForm = (problem: Problem) => {
        setEditingId(problem.id);
        setForm({
            title: problem.title,
            description: problem.description,
            difficlty: problem.difficlty,
            points: problem.points,
            acceptanceRate: problem.acceptanceRate,
            externalUrl: problem.externalUrl || "",
            tags: problem.tags.map((t) => t.name).join(", "),
        });
        setError(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            title: form.title,
            description: form.description,
            difficlty: form.difficlty,
            points: form.points,
            acceptanceRate: form.acceptanceRate,
            externalUrl: form.externalUrl || undefined,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        };

        try {
            const url = editingId
                ? `/api/admin/problems/${editingId}`
                : "/api/admin/problems";
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg =
                    typeof data.error === "string"
                        ? data.error
                        : Object.values(data.error || {}).flat().join(", ") ||
                          "Failed to save problem";
                setError(msg);
                return;
            }

            if (editingId) {
                setProblems((prev) =>
                    prev.map((p) => (p.id === editingId ? { ...p, ...data } : p))
                );
            } else {
                setProblems((prev) => [data, ...prev]);
            }

            closeForm();
            router.refresh();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this problem? This cannot be undone.")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/problems/${id}`, { method: "DELETE" });
            if (!res.ok) {
                alert("Failed to delete problem");
                return;
            }
            setProblems((prev) => prev.filter((p) => p.id !== id));
            router.refresh();
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-mono">
                    {problems.length} problem{problems.length !== 1 ? "s" : ""} in database
                </p>
                {!showForm && (
                    <Button onClick={openCreateForm} size="sm" className="gap-1.5">
                        <Plus className="w-4 h-4" />
                        Add Problem
                    </Button>
                )}
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-border bg-card/60 p-6 space-y-5 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-heading font-bold text-lg">
                            {editingId ? "Edit Problem" : "New Problem"}
                        </h2>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Title *
                            </label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Two Sum"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Description *
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                placeholder="Problem statement..."
                                required
                                rows={5}
                                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 resize-y min-h-[120px]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Difficulty
                            </label>
                            <select
                                value={form.difficlty}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        difficlty: e.target.value as FormData["difficlty"],
                                    })
                                }
                                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Points
                            </label>
                            <Input
                                type="number"
                                min={1}
                                max={1000}
                                value={form.points}
                                onChange={(e) =>
                                    setForm({ ...form, points: Number(e.target.value) })
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Acceptance Rate (%)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                step={0.1}
                                value={form.acceptanceRate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        acceptanceRate: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                External URL
                            </label>
                            <Input
                                type="url"
                                value={form.externalUrl}
                                onChange={(e) =>
                                    setForm({ ...form, externalUrl: e.target.value })
                                }
                                placeholder="https://leetcode.com/..."
                            />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Tags (comma-separated)
                            </label>
                            <Input
                                value={form.tags}
                                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                placeholder="Array, Hash Table, Dynamic Programming"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={loading} className="gap-1.5">
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {editingId ? "Save Changes" : "Create Problem"}
                        </Button>
                        <Button type="button" variant="outline" onClick={closeForm}>
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {problems.length === 0 && !showForm ? (
                <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
                    <p className="text-muted-foreground font-mono text-sm mb-4">
                        No problems yet. Add your first question to populate the problemset.
                    </p>
                    <Button onClick={openCreateForm} size="sm" className="gap-1.5">
                        <Plus className="w-4 h-4" />
                        Add Problem
                    </Button>
                </div>
            ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                                        Difficulty
                                    </th>
                                    <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                                        Tags
                                    </th>
                                    <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                                        Points
                                    </th>
                                    <th className="text-right px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((problem) => (
                                    <tr
                                        key={problem.id}
                                        className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{problem.title}</div>
                                            <div className="text-xs text-muted-foreground font-mono">
                                                {problem.slug}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded border uppercase",
                                                    difficultyColors[problem.difficlty]
                                                )}
                                            >
                                                {problem.difficlty}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {problem.tags.length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        +{problem.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell font-mono text-muted-foreground">
                                            {problem.points}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => openEditForm(problem)}
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleDelete(problem.id)}
                                                    disabled={deletingId === problem.id}
                                                    title="Delete"
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    {deletingId === problem.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
