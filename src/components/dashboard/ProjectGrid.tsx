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
            className="h-64 rounded-xl border border-border bg-card/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projectList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <h2 className="text-base font-semibold">No projects yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first project and describe what you want to build.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/project/demo">
            <Plus className="size-4 mr-1.5" aria-hidden="true" />
            New Project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or type..."
            className="pl-9 bg-card text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground ml-auto">
          Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No projects match &ldquo;{search}&rdquo;</p>
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
