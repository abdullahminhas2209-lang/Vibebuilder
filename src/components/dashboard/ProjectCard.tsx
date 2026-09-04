"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Copy,
  Dumbbell,
  ExternalLink,
  MoreVertical,
  ShoppingCart,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createProject, deleteProject } from "@/lib/supabase/db";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> =
  {
    draft: { label: "Draft", className: "bg-slate-800 text-slate-300 border border-slate-700/50" },
    active: { label: "Active", className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
    updated: { label: "Updated", className: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" },
  };

const thumbnailConfig: Record<string, { gradient: string; icon: typeof Sparkles }> =
  {
    "restaurant-booking": { gradient: "from-amber-500 to-orange-600", icon: UtensilsCrossed },
    "saas-analytics": { gradient: "from-sky-500 to-indigo-600", icon: BarChart3 },
    "personal-portfolio": { gradient: "from-violet-500 to-purple-600", icon: UserRound },
    "ecommerce-store": { gradient: "from-emerald-500 to-teal-600", icon: ShoppingCart },
    "fitness-landing": { gradient: "from-rose-500 to-red-600", icon: Dumbbell },
  };

const fallbackThumbnail = { gradient: "from-indigo-500 to-violet-700", icon: Sparkles };

export function ProjectCard({
  project,
  onRefresh,
}: {
  project: Project;
  onRefresh?: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = statusConfig[project.status] || statusConfig.active;
  const thumbnail = thumbnailConfig[project.id] ?? fallbackThumbnail;
  const ThumbnailIcon = thumbnail.icon;

  async function handleDuplicate() {
    try {
      await createProject({
        name: `${project.name} (Copy)`,
        type: project.type,
        description: project.description,
        status: "active",
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Duplicate failed:", err);
    }
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      await deleteProject(project.id);
      setDeleteOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Card className="group relative gap-0 overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A]/90 text-slate-100 py-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl">
        {/* Card-level link overlay */}
        <Link
          href={`/project/${project.id}`}
          className="absolute inset-0 z-0 focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 focus-visible:outline-none"
          aria-label={`Open project: ${project.name}`}
        />

        <div
          className={cn(
            "relative flex h-28 items-center justify-center bg-gradient-to-br",
            thumbnail.gradient,
          )}
        >
          <ThumbnailIcon
            className="size-9 text-white/90 transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow"
            aria-hidden="true"
          />
          <Badge
            className={cn(
              "absolute top-3 left-3 border-0 shadow-sm text-[10px] font-semibold",
              status.className,
            )}
          >
            {status.label}
          </Badge>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative z-10 -mt-1.5 -mr-1.5 size-7 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  aria-label={`Project options for ${project.name}`}
                >
                  <MoreVertical className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-[#0F172A] border-slate-800 text-slate-100 shadow-2xl rounded-xl p-1">
                <DropdownMenuItem asChild className="rounded-lg text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
                  <Link href={`/project/${project.id}`}>
                    <ExternalLink className="size-3.5 mr-2 text-indigo-400" aria-hidden="true" />
                    Open project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} className="rounded-lg text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
                  <Copy className="size-3.5 mr-2 text-slate-400" aria-hidden="true" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                  className="rounded-lg text-xs text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-3.5 mr-2" aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
            {project.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 font-medium">
            <span className="truncate">{project.type}</span>
            <span className="shrink-0">Updated {project.lastUpdated}</span>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-[#0B0F19] border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-rose-400 font-bold">Delete Project</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to delete <strong className="text-white">{project.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl border-slate-700 bg-slate-800/80 text-white text-xs hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
