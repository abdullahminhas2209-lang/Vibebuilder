"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
import { generateLivePreviewHtml } from "@/lib/render-preview";
import { saveProjectFiles } from "@/lib/supabase/db";
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
  project: initialProject,
  fileTree: initialFileTree,
  fileMap: initialFileMap,
  initialMessages,
}: WorkspaceShellProps) {
  const searchParams = useSearchParams();
  const urlPrompt = searchParams ? searchParams.get("prompt") : null;

  const [project, setProject] = useState<Project>(initialProject);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("preview");
  const [fileTree, setFileTree] = useState<FileNode[]>(initialFileTree);
  const [fileMap, setFileMap] = useState<Record<string, ProjectFile>>(initialFileMap);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(() =>
    initialProject.generated ? firstFilePath(initialFileTree) : null,
  );
  const [mobileView, setMobileView] = useState<MobileView>("chat");
  const [filesOpen, setFilesOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const selectedFile = selectedFilePath ? fileMap[selectedFilePath] : undefined;
  const filesList = Object.values(fileMap);

  // Clean URL prompt after mounting
  useEffect(() => {
    if (urlPrompt && typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [urlPrompt]);

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

    const allFilesList = Object.values(newFileMap);

    // Save to DB / local store
    saveProjectFiles(project.id, allFilesList);

    // Build real live interactive React preview HTML
    if (files.length > 0) {
      setGeneratedHtml(generateLivePreviewHtml(allFilesList));
    }

    // Switch to preview tab so user sees the live site immediately!
    setActiveTab("preview");
    setMobileView("preview");
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background">
      <WorkspaceHeader
        project={project}
        filesList={filesList}
        onShowPreview={handleShowPreview}
        onToggleFiles={() => setFilesOpen(true)}
        onProjectRenamed={(newName) => setProject((prev) => ({ ...prev, name: newName }))}
        mobileSwitcher={
          <MobileSwitcher value={mobileView} onChange={handleMobileViewChange} />
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* Chat panel — full width on mobile, left column from md up. */}
        <aside
          className={cn(
            "w-full shrink-0 border-r border-border bg-card md:block md:w-[320px] lg:w-[350px]",
            mobileView === "chat" ? "block" : "hidden",
          )}
        >
          <ChatPanel
            projectId={project.id}
            initialPrompt={urlPrompt}
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
