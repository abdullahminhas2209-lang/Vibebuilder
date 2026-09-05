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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-xl px-3 sm:px-4 text-slate-100">
      <Logo markOnly className="sm:hidden" />
      <Logo className="hidden sm:inline-flex" />

      <div className="mx-2 flex min-w-0 items-center gap-2.5">
        <span className="hidden h-5 w-px bg-slate-800 sm:block" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{projectName}</p>
        </div>
        <p className="hidden items-center gap-1.5 text-xs text-slate-400 lg:flex font-medium">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          Live
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {mobileSwitcher}

        <Button
          variant="outline"
          size="sm"
          onClick={onShowPreview}
          className="hidden md:inline-flex rounded-xl border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
        >
          <Eye className="size-3.5 mr-1" aria-hidden="true" />
          Preview
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadZip}
          disabled={downloading || filesList.length === 0}
          className="hidden sm:inline-flex gap-1.5 rounded-xl border-indigo-500/30 bg-indigo-600/20 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 hover:text-white shadow-xs"
          title="Download full runnable Next.js source code (.zip)"
        >
          {downloading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <FolderDown className="size-3.5 text-indigo-400" aria-hidden="true" />
          )}
          <span>Download Code</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="hidden md:inline-flex rounded-xl border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
        >
          <Share2 className="size-3.5 mr-1" aria-hidden="true" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleFiles}
          className="hidden md:inline-flex lg:hidden text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          aria-label="Open file explorer"
        >
          <PanelRight className="size-4" aria-hidden="true" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Project options" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
              <MoreVertical className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-[#0F172A] border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-1.5 ring-1 ring-white/10">
            <DropdownMenuLabel className="truncate text-xs font-semibold text-white">
              {projectName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem onClick={() => setRenameOpen(true)} className="rounded-lg text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
              <Pencil className="size-3.5 mr-2 text-indigo-400" aria-hidden="true" />
              Rename project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadZip} disabled={filesList.length === 0} className="rounded-lg text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
              <Download className="size-3.5 mr-2 text-indigo-400" aria-hidden="true" />
              Export .ZIP
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShareOpen(true)} className="rounded-lg text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
              <Share2 className="size-3.5 mr-2 text-indigo-400" aria-hidden="true" />
              Share link
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              className="rounded-lg text-xs text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
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
        <DialogContent className="sm:max-w-md bg-[#0B0F19] border-slate-800 text-slate-100 rounded-2xl shadow-2xl ring-1 ring-white/10">
          <DialogHeader>
            <DialogTitle className="text-white font-bold text-base">Share this project</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Anyone with this link can view this project and test the live interactive preview.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-2">
            <Input
              readOnly
              value={shareUrl}
              aria-label="Project share URL"
              onFocus={(event) => event.currentTarget.select()}
              className="font-mono text-xs bg-slate-950 border-slate-800 text-white rounded-xl"
            />
            <Button variant="outline" size="icon" onClick={handleCopyShareUrl} aria-label="Copy share URL" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white rounded-xl">
              {copied ? (
                <Check className="size-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md bg-[#0B0F19] border-slate-800 text-slate-100 rounded-2xl shadow-2xl ring-1 ring-white/10">
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle className="text-white font-bold text-base">Rename Project</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
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
                className="bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 caret-white text-xs"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setRenameOpen(false)} className="rounded-xl border-slate-700 bg-slate-800/80 text-white text-xs hover:bg-slate-700">
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading || !projectName.trim()} className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold">
                {actionLoading ? "Saving..." : "Save Name"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-[#0B0F19] border-slate-800 text-slate-100 rounded-2xl shadow-2xl ring-1 ring-white/10">
          <DialogHeader>
            <DialogTitle className="text-rose-400 font-bold text-base">Delete Project</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to delete <strong className="text-white">{projectName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl border-slate-700 bg-slate-800/80 text-white text-xs hover:bg-slate-700">
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {actionLoading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
