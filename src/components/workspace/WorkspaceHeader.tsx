"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Copy, Eye, PanelRight, Share2, MoreVertical } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { Project } from "@/lib/types";

interface WorkspaceHeaderProps {
  project: Project;
  /** Switches the center canvas to the preview tab. */
  onShowPreview: () => void;
  /** Opens the file explorer as an overlay (tablet widths). */
  onToggleFiles: () => void;
  /** Mobile panel switcher rendered on small screens. */
  mobileSwitcher?: ReactNode;
}

export function WorkspaceHeader({
  project,
  onShowPreview,
  onToggleFiles,
  mobileSwitcher,
}: WorkspaceHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://vibebuilder.app/p/${project.id}`;

  async function handleCopyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the URL stays selectable in the input.
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
      <Logo markOnly className="sm:hidden" />
      <Logo className="hidden sm:inline-flex" />

      <div className="mx-2 flex min-w-0 items-center gap-2.5">
        <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{project.name}</p>
        </div>
        <p className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary/60" />
          Saved
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
          <Eye aria-hidden="true" />
          Preview
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="hidden md:inline-flex"
        >
          <Share2 aria-hidden="true" />
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate">
              {project.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Rename</DropdownMenuItem>
            <DropdownMenuItem disabled>Project settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this project</DialogTitle>
            <DialogDescription>
              Sharing links are not available in this prototype yet — the URL
              below is a placeholder.
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
                <Check className="size-4 text-primary" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
