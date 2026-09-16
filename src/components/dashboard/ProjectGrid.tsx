"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { getProjects } from "@/lib/supabase/db";
import type { Project } from "@/lib/types";

export function ProjectGrid() {
  const router = useRouter();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjectList(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  async function handleCreateFirstProject() {
    try {
      const { createProject } = await import("@/lib/supabase/db");
      const newProj = await createProject({
        name: "New Web Application",
        type: "Web Application",
        description: "A new workspace ready for your prompts.",
        status: "active",
      });
      router.push(`/project/${newProj.id}`);
    } catch {
      router.push(`/project/proj_${Date.now()}`);
    }
  }

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
            className="h-64 rounded-md border border-slate-line bg-ink-raised/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projectList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-line bg-ink-raised/20 py-20 px-6 text-center">
        <h2 className="font-serif text-lg font-bold text-cream">No projects yet</h2>
        <p className="mt-1.5 max-w-sm text-xs text-fog font-sans">
          Create your first project and describe what you want to build.
        </p>
        <Button
          onClick={handleCreateFirstProject}
          className="mt-6 rounded-sm bg-amber hover:bg-amber-deep text-[#14161f] text-xs font-mono font-semibold shadow-xs cursor-pointer px-4 py-2"
        >
          <Plus className="size-4 mr-1.5" aria-hidden="true" />
          New Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or type..."
            className="pl-9 h-10 bg-ink-raised border-slate-line text-cream placeholder:text-fog-dim rounded-sm font-mono text-xs focus:border-amber/60 focus:ring-1 focus:ring-amber/30 caret-amber"
          />
        </div>
        <p className="text-xs font-mono text-fog-dim ml-auto">
          Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-line bg-ink-raised/20 p-12 text-center">
          <p className="text-xs font-mono text-fog">No projects match &ldquo;{search}&rdquo;</p>
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
