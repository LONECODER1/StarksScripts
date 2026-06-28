"use client"

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";

export interface CompanyData {
  id: string;
  name: string;
  count: number;
}

interface CompanyShelfProps {
  companies: CompanyData[];
}

export default function CompanyShelf({ companies = [] }: CompanyShelfProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const listRef = useRef<HTMLDivElement>(null);

  // Filter companies based on search
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / itemsPerPage));

  // Slice companies for current page
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full h-full rounded-2xl border border-border bg-card/60 backdrop-blur-md text-foreground shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Title Header with Pagination Controls */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs tracking-wider uppercase text-foreground">
          Trending Companies
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-1 hover:bg-accent/40 disabled:opacity-40 rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-muted-foreground select-none">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-accent/40 disabled:opacity-40 rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search for a company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-muted/40 border border-border rounded-lg outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60 transition-colors"
          />
        </div>
      </div>

      {/* Tags List Container */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar relative flex flex-wrap gap-2.5 content-start pb-16"
      >
        {paginatedCompanies.length > 0 ? (
          paginatedCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border/80 hover:border-primary/30 rounded-full text-xs font-heading font-semibold hover:bg-muted/80 transition-all cursor-pointer shadow-sm select-none"
            >
              <span className="text-foreground/90">{company.name}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/90 text-black rounded-full shadow-inner">
                {company.count}
              </span>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-xs font-sans text-muted-foreground uppercase tracking-wider">
            No companies found
          </div>
        )}
        {/* 
        {/* Scroll To Top Action Button */}
         {paginatedCompanies.length > 6 && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-muted/95 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 shadow-md hover:scale-105 transition-all"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )} 
      </div>
    </div>
  );
}
