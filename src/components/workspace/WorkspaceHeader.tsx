"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Download,
  Eye,
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
  onShowPreview: () => void;
  /** Opens the file explorer as an overlay (tablet widths). */
  onToggleFiles: () => void;
  /** Mobile panel switcher rendered on small screens. */
  mobileSwitcher?: ReactNode;
  onProjectRenamed?: (newName: string) => void;
}

export function WorkspaceHeader({
  project,
  filesList,
  onShowPreview,
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

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://vibebuilder.app/project/${project.id}`;

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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
      <Logo markOnly className="sm:hidden" />
      <Logo className="hidden sm:inline-flex" />

      <div className="mx-2 flex min-w-0 items-center gap-2.5">
        <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{projectName}</p>
        </div>
        <p className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
          Live
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {mobileSwitcher}

        <Button
          variant="outline"
          size="sm"
          onClick={onShowPreview}
          className="hidden md:inline-flex"
        >
          <Eye className="size-3.5" aria-hidden="true" />
          Preview
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadZip}
          disabled={downloading || filesList.length === 0}
          className="hidden sm:inline-flex gap-1.5"
          title="Download full runnable Next.js source code (.zip)"
        >
          {downloading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <FolderDown className="size-3.5 text-primary" aria-hidden="true" />
          )}
          <span>Download Code</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="hidden md:inline-flex"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleFiles}
          className="hidden md:inline-flex lg:hidden"
          aria-label="Open file explorer"
        >
          <PanelRight className="size-4" aria-hidden="true" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Project options">
              <MoreVertical className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="truncate">
              {projectName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRenameOpen(true)}>
              <Pencil className="size-4 mr-2" aria-hidden="true" />
              Rename project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadZip} disabled={filesList.length === 0}>
              <Download className="size-4 mr-2" aria-hidden="true" />
              Export .ZIP
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShareOpen(true)}>
              <Share2 className="size-4 mr-2" aria-hidden="true" />
              Share link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4 mr-2" aria-hidden="true" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this project</DialogTitle>
            <DialogDescription>
              Anyone with this link can view this project and test the live interactive preview.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={shareUrl}
              aria-label="Project share URL"
              onFocus={(event) => event.currentTarget.select()}
              className="font-mono text-xs"
            />
            <Button variant="outline" size="icon" onClick={handleCopyShareUrl} aria-label="Copy share URL">
              {copied ? (
                <Check className="size-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
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
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading || !projectName.trim()}>
                {actionLoading ? "Saving..." : "Save Name"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{projectName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
