import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { projects } from "@/lib/mock-data";

export function ProjectGrid() {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <h2 className="text-base font-semibold">No projects yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first project and describe what you want to build.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/project/demo">
            <Plus aria-hidden="true" />
            New Project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
