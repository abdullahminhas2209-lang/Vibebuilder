"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { CodePanel } from "@/components/workspace/CodePanel";
import { FileExplorer } from "@/components/workspace/FileExplorer";
import { PreviewPanel } from "@/components/workspace/PreviewPanel";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import type {
  ChatMessage,
  FileNode,
  Project,
  ProjectFile,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type MobileView = "chat" | "preview" | "code" | "files";
type WorkspaceTab = "preview" | "code";

const MOBILE_VIEWS: MobileView[] = ["chat", "preview", "code", "files"];

interface WorkspaceShellProps {
  project: Project;
  fileTree: FileNode[];
  fileMap: Record<string, ProjectFile>;
  initialMessages: ChatMessage[];
}

function FilesPanel({
  fileTree,
  selectedFilePath,
  onSelect,
}: {
  fileTree: FileNode[];
  selectedFilePath: string | null;
  onSelect: (path: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-11 shrink-0 items-center border-b border-border px-4">
        <p className="text-sm font-medium">Files</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-panel">
        {fileTree.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No files yet. Describe what you want to build and generated files
            will appear here.
          </p>
        ) : (
          <FileExplorer
            nodes={fileTree}
            selectedPath={selectedFilePath}
            onSelect={onSelect}
          />
        )}
      </div>
    </div>
  );
}

function MobileSwitcher({
  value,
  onChange,
}: {
  value: MobileView;
  onChange: (view: MobileView) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Workspace panels"
      className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5 md:hidden"
    >
      {MOBILE_VIEWS.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onChange(view)}
          aria-pressed={value === view}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            value === view
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {view}
        </button>
      ))}
    </div>
  );
}

/** First file path in the tree (depth-first) — default code-panel selection. */
function firstFilePath(nodes: FileNode[]): string | null {
  for (const node of nodes) {
    if (node.type === "file") {
      return node.path;
    }
    if (node.children) {
      const nested = firstFilePath(node.children);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

export function WorkspaceShell({
  project,
  fileTree: initialFileTree,
  fileMap: initialFileMap,
  initialMessages,
}: WorkspaceShellProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("preview");
  const [fileTree, setFileTree] = useState<FileNode[]>(initialFileTree);
  const [fileMap, setFileMap] = useState<Record<string, ProjectFile>>(initialFileMap);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(() =>
    project.generated ? firstFilePath(initialFileTree) : null,
  );
  const [mobileView, setMobileView] = useState<MobileView>("chat");
  const [filesOpen, setFilesOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const selectedFile = selectedFilePath ? fileMap[selectedFilePath] : undefined;

  function handleMobileViewChange(view: MobileView) {
    setMobileView(view);
    if (view === "preview" || view === "code") {
      setActiveTab(view);
    }
  }

  function handleShowPreview() {
    setActiveTab("preview");
    setMobileView("preview");
  }

  /** Called by ChatPanel when Gemini returns generated files. */
  function handleFilesGenerated(files: ProjectFile[], tree: FileNode[]) {
    // Merge new files into existing map
    const newFileMap: Record<string, ProjectFile> = { ...fileMap };
    for (const file of files) {
      newFileMap[file.path] = file;
    }

    setFileMap(newFileMap);
    setFileTree(tree);

    // Auto-select first file in code panel
    const firstPath = firstFilePath(tree);
    if (firstPath) setSelectedFilePath(firstPath);

    // Build a simple HTML preview from the generated files
    const pageFile = files.find(
      (f) => f.path === "app/page.tsx" || f.name === "page.tsx"
    );
    if (pageFile) {
      setGeneratedHtml(buildHtmlPreview(pageFile.code, files));
    }

    // Switch to code tab to show generated files
    setActiveTab("code");
    setMobileView("code");
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background">
      <WorkspaceHeader
        project={project}
        onShowPreview={handleShowPreview}
        onToggleFiles={() => setFilesOpen(true)}
        mobileSwitcher={
          <MobileSwitcher value={mobileView} onChange={handleMobileViewChange} />
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* Chat panel — full width on mobile, left column from md up. */}
        <aside
          className={cn(
            "w-full shrink-0 border-r border-border bg-card md:block md:w-[300px] lg:w-[320px]",
            mobileView === "chat" ? "block" : "hidden",
          )}
        >
          <ChatPanel
            initialMessages={initialMessages}
            onFilesGenerated={handleFilesGenerated}
          />
        </aside>

        {/* Center canvas — Preview/Code tabs. */}
        <main
          className={cn(
            "min-w-0 flex-1 md:block",
            mobileView === "preview" || mobileView === "code"
              ? "block"
              : "hidden",
          )}
        >
          <WorkspaceTabs
            value={activeTab}
            onValueChange={setActiveTab}
            preview={
              <PreviewPanel
                project={project}
                generatedHtml={generatedHtml}
              />
            }
            code={<CodePanel file={selectedFile} />}
          />
        </main>

        {/* File explorer — right column on lg. */}
        <aside
          className={cn(
            "w-full shrink-0 border-l border-border bg-card lg:w-[260px]",
            mobileView === "files" ? "block" : "hidden lg:block",
          )}
        >
          <FilesPanel
            fileTree={fileTree}
            selectedFilePath={selectedFilePath}
            onSelect={setSelectedFilePath}
          />
        </aside>
      </div>

      {/* Tablet file explorer overlay (md–lg). */}
      <Sheet open={filesOpen} onOpenChange={setFilesOpen}>
        <SheetContent side="right" className="w-80 gap-0 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Project files</SheetTitle>
          </SheetHeader>
          <FilesPanel
            fileTree={fileTree}
            selectedFilePath={selectedFilePath}
            onSelect={setSelectedFilePath}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

/**
 * Build a minimal HTML string from generated TSX code for iframe preview.
 * This is a best-effort display — not a real renderer.
 */
function buildHtmlPreview(pageCode: string, allFiles: ProjectFile[]): string {
  // Extract JSX return content (very simplified)
  const tailwindCdn = `<script src="https://cdn.tailwindcss.com"></script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  ${tailwindCdn}
</head>
<body class="bg-white font-sans">
  <div id="root" class="min-h-screen">
    <div class="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-4">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Code Generated</h1>
        <p class="text-slate-600 mb-6">
          Your application has been generated. View the files in the Code tab on the right.
          A full live preview requires running the Next.js dev server locally.
        </p>
        <div class="text-left bg-slate-900 rounded-xl p-4 overflow-auto max-h-96">
          <pre class="text-xs text-green-400 whitespace-pre-wrap">${escapeHtml(pageCode.slice(0, 1500))}${pageCode.length > 1500 ? "\n\n... (truncated, view in Code tab)" : ""}</pre>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
