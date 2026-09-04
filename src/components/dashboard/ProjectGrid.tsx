"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { getProjects } from "@/lib/supabase/db";
import type { Project } from "@/lib/types";

export function ProjectGrid() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjectList(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projectList.filter((p) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.type && p.type.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projectList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 py-16 text-center">
        <h2 className="text-base font-semibold text-white">No projects yet</h2>
        <p className="mt-1 max-w-sm text-xs text-slate-400">
          Create your first project and describe what you want to build.
        </p>
        <Button className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-semibold text-white" asChild>
          <Link href="/project/demo">
            <Plus className="size-4 mr-1.5" aria-hidden="true" />
            New Project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or type..."
            className="pl-9 h-10 bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 caret-white"
          />
        </div>
        <p className="text-xs text-slate-400 ml-auto font-medium">
          Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <p className="text-xs text-slate-400">No projects match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index * 50, 250)}ms` }}
            >
              <ProjectCard project={project} onRefresh={loadProjects} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
