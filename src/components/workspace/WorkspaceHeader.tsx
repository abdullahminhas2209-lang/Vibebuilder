"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Download,
  FolderDown,
  Loader2,
  MoreVertical,
  PanelRight,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { downloadProjectZip } from "@/lib/export-zip";
import { updateProject, deleteProject } from "@/lib/supabase/db";
import type { Project, ProjectFile } from "@/lib/types";

interface WorkspaceHeaderProps {
  project: Project;
  filesList: ProjectFile[];
  /** Switches the center canvas to the preview tab. */
  onShowPreview?: () => void;
  /** Opens the file explorer as an overlay (tablet widths). */
  onToggleFiles: () => void;
  /** Mobile panel switcher rendered on small screens. */
  mobileSwitcher?: ReactNode;
  onProjectRenamed?: (newName: string) => void;
}

export function WorkspaceHeader({
  project,
  filesList,
  onToggleFiles,
  mobileSwitcher,
  onProjectRenamed,
}: WorkspaceHeaderProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://klyro.app/project/${project.id}`;

  async function handleCopyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  async function handleDownloadZip() {
    if (filesList.length === 0 || downloading) return;
    try {
      setDownloading(true);
      await downloadProjectZip(projectName || project.name, filesList);
    } catch (err) {
      console.error("Failed to download zip:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim()) return;
    setActionLoading(true);
    try {
      await updateProject(project.id, { name: projectName.trim() });
      if (onProjectRenamed) onProjectRenamed(projectName.trim());
      setRenameOpen(false);
    } catch (err) {
      console.error("Rename error:", err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      await deleteProject(project.id);
      router.push("/dashboard");
    } catch (err) {
      console.error("Delete error:", err);
      setActionLoading(false);
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-line bg-ink px-3 sm:px-4 text-cream font-sans">
      <Logo markOnly className="sm:hidden" />
      <Logo className="hidden sm:inline-flex" />

      <div className="mx-2 flex min-w-0 items-center gap-2.5">
        <span className="hidden h-5 w-px bg-slate-line sm:block" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-semibold text-cream">{projectName}</p>
        </div>
        <p className="hidden items-center gap-1.5 text-xs text-fog font-mono lg:flex font-medium">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-amber shadow-[0_0_8px_rgba(242,169,59,0.8)]" />
          Live
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {mobileSwitcher}

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadZip}
          disabled={downloading || filesList.length === 0}
          className="hidden sm:inline-flex gap-1.5 rounded-sm border border-amber/40 bg-amber text-xs font-semibold text-[#14161f] hover:bg-amber-deep shadow-xs transition-colors cursor-pointer"
          title="Download full runnable Next.js source code (.zip)"
        >
          {downloading ? (
            <Loader2 className="size-3.5 animate-spin text-[#14161f]" aria-hidden="true" />
          ) : (
            <FolderDown className="size-3.5 text-[#14161f]" aria-hidden="true" />
          )}
          <span>Download Code</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="hidden md:inline-flex rounded-sm border border-slate-line bg-ink-raised text-xs font-semibold text-cream hover:bg-ink hover:border-slate-line transition-colors cursor-pointer"
        >
          <Share2 className="size-3.5 mr-1 text-fog" aria-hidden="true" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleFiles}
          className="hidden md:inline-flex lg:hidden text-fog hover:text-cream hover:bg-ink-raised rounded-sm"
          aria-label="Open file explorer"
        >
          <PanelRight className="size-4" aria-hidden="true" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Project options" className="text-fog hover:text-cream hover:bg-ink-raised rounded-sm">
              <MoreVertical className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-ink-raised border-slate-line text-cream shadow-2xl rounded-md p-1 ring-1 ring-white/5 font-sans">
            <DropdownMenuLabel className="truncate font-serif text-xs font-semibold text-cream px-2 py-1.5">
              {projectName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-line" />
            <DropdownMenuItem onClick={() => setRenameOpen(true)} className="rounded-sm text-xs cursor-pointer focus:bg-ink focus:text-amber">
              <Pencil className="size-3.5 mr-2 text-amber" aria-hidden="true" />
              Rename project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadZip} disabled={filesList.length === 0} className="rounded-sm text-xs cursor-pointer focus:bg-ink focus:text-amber">
              <Download className="size-3.5 mr-2 text-amber" aria-hidden="true" />
              Export .ZIP
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShareOpen(true)} className="rounded-sm text-xs cursor-pointer focus:bg-ink focus:text-amber">
              <Share2 className="size-3.5 mr-2 text-amber" aria-hidden="true" />
              Share link
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-line" />
            <DropdownMenuItem
              className="rounded-sm text-xs text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5 mr-2" aria-hidden="true" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md bg-ink-raised border-slate-line text-cream rounded-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-cream font-serif font-semibold text-base">Share this project</DialogTitle>
            <DialogDescription className="text-fog text-xs font-sans">
              Anyone with this link can view this project and test the live interactive preview.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-2">
            <Input
              readOnly
              value={shareUrl}
              aria-label="Project share URL"
              onFocus={(event) => event.currentTarget.select()}
              className="font-mono text-xs bg-ink border-slate-line text-cream rounded-sm"
            />
            <Button variant="outline" size="icon" onClick={handleCopyShareUrl} aria-label="Copy share URL" className="border-slate-line bg-ink text-fog hover:bg-ink-raised hover:text-cream rounded-sm">
              {copied ? (
                <Check className="size-4 text-amber" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md bg-ink-raised border-slate-line text-cream rounded-md shadow-2xl">
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle className="text-cream font-serif font-semibold text-base">Rename Project</DialogTitle>
              <DialogDescription className="text-fog text-xs font-sans">
                Enter a new title for this project.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Modern Restaurant Site"
                autoFocus
                required
                className="bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber/70 focus:ring-1 focus:ring-amber/30 text-xs font-sans"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setRenameOpen(false)} className="rounded-sm border-slate-line bg-ink text-cream text-xs hover:bg-ink-raised">
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading || !projectName.trim()} className="rounded-sm bg-amber text-[#14161f] text-xs font-semibold hover:bg-amber-deep">
                {actionLoading ? "Saving..." : "Save Name"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-ink-raised border-slate-line text-cream rounded-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-rose-400 font-serif font-semibold text-base">Delete Project</DialogTitle>
            <DialogDescription className="text-fog text-xs font-sans">
              Are you sure you want to delete <strong className="text-cream">{projectName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-sm border-slate-line bg-ink text-cream text-xs hover:bg-ink-raised">
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              className="rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {actionLoading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
