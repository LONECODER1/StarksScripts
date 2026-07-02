"use client"

import React, { useState, useMemo } from "react";
import {
  Check,
  Calendar as CalendarIcon,
  Lock,
  Search,
  SlidersHorizontal,
  Shuffle,
  ChevronDown,
  ArrowUpDown,
  FileText,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInfo {
  name: string;
  count: number;
}

interface ProblemItem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  acceptanceRate?: number;
  externalUrl?: string | null;
  tags?: { name: string }[];
  solved?: boolean;
}

interface ProblemTableProps {
  data: ProblemItem[];
}

export default function ProblemTable({ data = [] }: ProblemTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"title" | "acceptance" | "difficulty" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Derive tag counts from actual problem data
  const topicTags: TagInfo[] = useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((p) => {
      p.tags?.forEach((t) => {
        counts.set(t.name, (counts.get(t.name) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Filters (Algorithms, Database etc)
  const filterPills = [
    "All Topics",
    "Algorithms",
    "Database",
    "Shell",
    "Concurrency",
    "JavaScript",
    "Pandas"
  ];

  // Solved statistics calculation
  const solvedCount = useMemo(() => data.filter(p => p.solved).length, [data]);
  const totalCount = data.length;
  const solvedPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Handles sorting and filtering
  const processedProblems = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query)
      );
    }

    // Filter by tag if clicked
    if (selectedTag) {
      result = result.filter(p =>
        p.tags?.some(t => t.name.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let valA: any = a[sortField === "acceptance" ? "acceptanceRate" : sortField] || 0;
        let valB: any = b[sortField === "acceptance" ? "acceptanceRate" : sortField] || 0;

        if (sortField === "difficulty") {
          const diffMap = { Easy: 1, Medium: 2, Hard: 3 };
          valA = diffMap[a.difficulty] || 1;
          valB = diffMap[b.difficulty] || 1;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, selectedTag, sortField, sortOrder]);

  const toggleSort = (field: "title" | "acceptance" | "difficulty") => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Pick random question handler
  const pickRandom = () => {
    if (data.length > 0) {
      const randomIdx = Math.floor(Math.random() * data.length);
      const problem = data[randomIdx];
      alert(`Random Module Selected: ${problem.title}\nInitializing compiler...`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-foreground">
      {/* 1. Horizontal Scrollable Topic Tags with count badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {topicTags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-colors shrink-0 font-sans border",
              selectedTag === tag.name
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/30 hover:bg-muted/60 text-muted-foreground border-border/40 hover:text-foreground"
            )}
          >
            <span>{tag.name}</span>
            <span className="text-[10px] opacity-70 font-mono">({tag.count})</span>
          </button>
        ))}
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0 font-medium px-2">
          Expand <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Secondary Row of Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
        {filterPills.map((pill) => (
          <button
            key={pill}
            onClick={() => setSelectedTopic(pill)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider font-heading transition-all border select-none cursor-pointer shrink-0",
              selectedTopic === pill
                ? "bg-foreground text-background border-foreground font-bold"
                : "bg-transparent text-muted-foreground hover:text-foreground border-border hover:bg-muted/20"
            )}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* 3. Search and Solved status bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-border/80">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-muted/30 border border-border rounded-lg outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60 transition-colors"
            />
          </div>
          <button
            onClick={() => toggleSort("title")}
            className="p-2 hover:bg-muted/40 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Sort Modules"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted/40 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0" title="More Filters">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Circular progress and Randomizer */}
        <div className="flex items-center gap-6 self-end md:self-auto select-none font-mono">
          <div className="flex items-center gap-2.5">
            {/* SVG circle track */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  className="stroke-muted/30 fill-transparent"
                  strokeWidth="2.5"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  className="stroke-green-500 fill-transparent transition-all"
                  strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  strokeDashoffset={`${2 * Math.PI * 13 * (1 - solvedPercentage / 100)}`}
                />
              </svg>
              <div className="absolute text-[8px] font-bold text-green-400">
                {solvedPercentage}%
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">
                {solvedCount}/{totalCount} Solved
              </span>
              <span className="text-[9px] text-muted-foreground tracking-tight">
                // SYSTEM COMPILER INTEGRATED
              </span>
            </div>
          </div>

          <button
            onClick={pickRandom}
            className="p-2 hover:bg-muted/40 border border-border rounded-lg text-muted-foreground hover:text-primary transition-all shrink-0 cursor-pointer"
            title="Random Module Pick"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Problems Table */}
      <div className="border border-border/80 bg-card/25 backdrop-blur-md rounded-xl overflow-x-auto shadow-md">
        <table className="w-full border-collapse text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold">
              <th className="p-4 w-16 text-center">Status</th>
              <th className="p-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("title")}>
                <div className="flex items-center gap-1">
                  Title
                  {sortField === "title" && <span className="text-[10px] text-primary">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                </div>
              </th>
              <th className="p-4 w-20 text-center">Solution</th>
              <th className="p-4 cursor-pointer hover:text-foreground transition-colors w-24 text-center" onClick={() => toggleSort("acceptance")}>
                <div className="flex items-center gap-1 justify-center">
                  Acceptance
                  {sortField === "acceptance" && <span className="text-[10px] text-primary">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                </div>
              </th>
              <th className="p-4 cursor-pointer hover:text-foreground transition-colors w-28 text-center" onClick={() => toggleSort("difficulty")}>
                <div className="flex items-center gap-1 justify-center">
                  Difficulty
                  {sortField === "difficulty" && <span className="text-[10px] text-primary">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                </div>
              </th>
              <th className="p-4 w-28 text-center">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {processedProblems.length > 0 ? (
              processedProblems.map((problem, idx) => (
                <tr
                  key={problem.id}
                  className="hover:bg-muted/20 transition-all border-b border-border/30 group odd:bg-muted/5 even:bg-transparent"
                >
                  {/* Status column */}
                  <td className="p-4 text-center">
                    {problem.solved ? (
                      <Check className="w-4 h-4 text-green-500 stroke-[3] mx-auto" />
                    ) : idx === 0 ? (
                      <CalendarIcon className="w-4 h-4 text-primary/70 mx-auto" />
                    ) : null}
                  </td>

                  {/* Title column */}
                  <td className="p-4 max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex items-center gap-2 w-full truncate">
                        <a
                          href={problem.externalUrl || `#`}
                          target={problem.externalUrl ? "_blank" : undefined}
                          rel="noreferrer"
                          className="font-sans font-medium text-sm hover:text-primary text-foreground transition-colors truncate block w-full"
                        >
                          {idx + 1}. {problem.title}
                        </a>
                      </div>
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-hidden mt-0.5">
                          {problem.tags.slice(0, 2).map((t) => (
                            <span key={t.name} className="px-1.5 py-0.2 bg-muted/40 text-[9px] text-muted-foreground/85 font-mono rounded">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Solution Column */}
                  <td className="p-4 text-center">
                    <FileText className="w-4 h-4 text-blue-500/70 hover:text-blue-500 cursor-pointer mx-auto" />
                  </td>

                  {/* Acceptance Column */}
                  <td className="p-4 text-center font-sans text-muted-foreground font-medium">
                    {problem.acceptanceRate ? `${problem.acceptanceRate.toFixed(1)}%` : "0.0%"}
                  </td>

                  {/* Difficulty Column */}
                  <td className="p-4 text-center font-sans font-medium">
                    <span
                      className={cn(
                        problem.difficulty === "Easy"
                          ? "text-green-500"
                          : problem.difficulty === "Medium"
                            ? "text-amber-500"
                            : "text-red-500"
                      )}
                    >
                      {problem.difficulty === "Medium" ? "Med." : problem.difficulty}
                    </span>
                  </td>

                  {/* Frequency / Lock Column */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      {idx > 3 ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                      ) : (
                        <>
                          <div className="w-16 bg-muted/40 h-1.5 rounded-full overflow-hidden border border-border/30">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${100 - idx * 20}%` }}
                            />
                          </div>
                          {idx === 2 && (
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 cursor-pointer" />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-sm font-heading tracking-widest text-muted-foreground uppercase">
                  No modules detected on this grid.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}