"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Copy,
  Dumbbell,
  ExternalLink,
  Layers,
  MoreVertical,
  ShoppingCart,
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
    draft: { label: "Draft", className: "bg-ink border-slate-line text-fog-dim" },
    active: { label: "Active", className: "bg-amber/15 text-amber border-amber/30" },
    updated: { label: "Updated", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  };

function getThumbnailIcon(type?: string) {
  const lower = (type || "").toLowerCase();
  if (lower.includes("store") || lower.includes("commerce")) return ShoppingCart;
  if (lower.includes("analytics") || lower.includes("dash")) return BarChart3;
  if (lower.includes("port") || lower.includes("user") || lower.includes("personal")) return UserRound;
  if (lower.includes("food") || lower.includes("rest") || lower.includes("cafe")) return UtensilsCrossed;
  if (lower.includes("fit") || lower.includes("gym")) return Dumbbell;
  return Layers;
}

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
  const ThumbnailIcon = getThumbnailIcon(project.type);

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
      <Card className="group relative gap-0 overflow-hidden rounded-md border border-slate-line bg-ink-raised text-cream py-0 shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-amber/40 hover:shadow-[0_12px_24px_-8px_rgba(242,169,59,0.12)] flex flex-col">
        {/* Card-level link overlay */}
        <Link
          href={`/project/${project.id}`}
          className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:outline-none"
          aria-label={`Open project: ${project.name}`}
        />

        <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-ink to-[#1a1d28] border-b border-slate-line overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber/10 via-transparent to-transparent opacity-70" />
          <ThumbnailIcon
            className="size-8 text-amber/70 group-hover:text-amber group-hover:scale-110 transition-transform duration-300 drop-shadow"
            aria-hidden="true"
          />
          <Badge
            className={cn(
              "absolute top-3 left-3 border text-[10px] font-mono uppercase tracking-wider font-semibold rounded-sm px-2 py-0.5 shadow-xs",
              status.className,
            )}
          >
            {status.label}
          </Badge>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-serif text-sm font-bold text-cream group-hover:text-amber transition-colors duration-150">
              {project.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative z-10 -mt-1 -mr-1 size-7 text-fog hover:text-cream hover:bg-ink active:scale-95 transition-all rounded-sm cursor-pointer"
                  aria-label={`Project options for ${project.name}`}
                >
                  <MoreVertical className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-ink-raised border-slate-line text-cream shadow-2xl rounded-md p-1.5 font-sans">
                <DropdownMenuItem asChild className="rounded-sm text-xs font-mono cursor-pointer focus:bg-ink focus:text-cream">
                  <Link href={`/project/${project.id}`}>
                    <ExternalLink className="size-3.5 mr-2 text-amber" aria-hidden="true" />
                    Open project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} className="rounded-sm text-xs font-mono cursor-pointer focus:bg-ink focus:text-cream">
                  <Copy className="size-3.5 mr-2 text-fog" aria-hidden="true" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-line" />
                <DropdownMenuItem
                  className="rounded-sm text-xs font-mono text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-3.5 mr-2" aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs text-fog leading-relaxed font-sans">
            {project.description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-line text-[11px] font-mono text-fog-dim">
            <span className="truncate uppercase tracking-wider">{project.type}</span>
            <span className="shrink-0">Updated {project.lastUpdated}</span>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-ink-raised border-slate-line text-cream rounded-md p-6 font-sans shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-rose-400 font-serif font-bold text-base">Delete Project</DialogTitle>
            <DialogDescription className="text-fog text-xs font-sans mt-1">
              Are you sure you want to delete <strong className="text-cream">{project.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-sm border-slate-line bg-ink text-fog hover:text-cream hover:bg-ink-raised text-xs font-mono cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDeleteConfirm}
              className="rounded-sm bg-rose-600 hover:bg-rose-700 text-cream text-xs font-mono font-semibold cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
