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
    <div className="flex h-full min-h-0 flex-col bg-[#0B0F19] text-slate-200">
      <div className="flex h-12 shrink-0 items-center border-b border-slate-800 px-4 bg-[#0B0F19]">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Files</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-panel">
        {fileTree.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-slate-500 leading-relaxed">
            No files generated yet. Describe what you want to build in chat and generated components
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
      className="flex items-center gap-0.5 rounded-xl border border-slate-800 bg-slate-900/90 p-0.5 md:hidden"
    >
      {MOBILE_VIEWS.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onChange(view)}
          aria-pressed={value === view}
          className={cn(
            "rounded-lg px-2 py-1 text-xs font-semibold capitalize transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none",
            value === view
              ? "bg-slate-800 text-white shadow-xs"
              : "text-slate-400 hover:text-white",
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

  // Hydrate saved files and preview from DB / localStorage if available
  useEffect(() => {
    async function hydrateProjectData() {
      try {
        const { getProject: fetchProject, getProjectFiles: fetchFiles } = await import("@/lib/supabase/db");
        const { buildFileTree: makeTree } = await import("@/lib/parse-ai-response");
        
        const [savedProj, savedFiles] = await Promise.all([
          fetchProject(initialProject.id),
          fetchFiles(initialProject.id),
        ]);

        if (savedProj) {
          setProject((prev) => ({ ...prev, ...savedProj }));
        }

        if (savedFiles && savedFiles.length > 0) {
          const newMap: Record<string, ProjectFile> = {};
          for (const f of savedFiles) {
            newMap[f.path] = f;
          }
          setFileMap(newMap);
          const tree = makeTree(savedFiles);
          setFileTree(tree);
          const first = firstFilePath(tree);
          if (first) setSelectedFilePath(first);
          setGeneratedHtml(generateLivePreviewHtml(savedFiles));
        }
      } catch (err) {
        console.warn("Project hydration error:", err);
      }
    }

    hydrateProjectData();
  }, [initialProject.id]);

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
  async function handleFilesGenerated(files: ProjectFile[], tree: FileNode[]) {
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

    // Derive a clean name from prompt if project had generic name
    let currentName = project.name;
    if (currentName === "Custom Project" || currentName === "Demo Project" || currentName === "My Project") {
      if (urlPrompt) {
        const words = urlPrompt
          .replace(/^(build|create|design|make)\s+(a|an|the)?\s*/i, "")
          .split(/\s+/)
          .slice(0, 4)
          .join(" ");
        currentName = words.charAt(0).toUpperCase() + words.slice(1);
      }
    }

    const updatedProject: Project = {
      ...project,
      name: currentName,
      description: urlPrompt || project.description || "Generated with Klyro AI",
      generated: true,
      lastUpdated: "Just now",
    };
    setProject(updatedProject);

    // Save project metadata and files to DB / local store
    const { createProject: saveProj } = await import("@/lib/supabase/db");
    await saveProj(updatedProject);
    await saveProjectFiles(project.id, allFilesList);

    // Build real live interactive React preview HTML
    if (files.length > 0) {
      setGeneratedHtml(generateLivePreviewHtml(allFilesList));
    }

    // Switch to preview tab so user sees the live site immediately!
    setActiveTab("preview");
    setMobileView("preview");
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white">
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
            "w-full shrink-0 border-r border-slate-800 bg-[#0B0F19] md:block md:w-[320px] lg:w-[350px]",
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
            "min-w-0 flex-1 md:block bg-[#070A11]",
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
            "w-full shrink-0 border-l border-slate-800 bg-[#0B0F19] lg:w-[260px]",
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
        <SheetContent side="right" className="w-80 gap-0 p-0 bg-[#0B0F19] border-slate-800 text-slate-100">
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
