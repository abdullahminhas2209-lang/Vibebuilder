"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Lock,
  Maximize,
  Minimize,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MockSite } from "@/components/workspace/MockSite";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportClasses: Record<ViewportSize, string> = {
  desktop: "w-full min-h-full",
  tablet: "w-full max-w-[768px] min-h-[90%] my-4 rounded-2xl border border-slate-700 bg-white shadow-2xl overflow-hidden",
  mobile: "w-full max-w-[375px] min-h-[667px] my-4 rounded-3xl border border-slate-700 bg-white shadow-2xl overflow-hidden",
};

export function PreviewPanel({
  project,
  generatedHtml,
}: {
  project: Project;
  generatedHtml?: string | null;
}) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isReloading, setIsReloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const previewUrl = `https://${project.id}.preview.klyro.app`;

  function handleReload() {
    if (isReloading || (!project.generated && !generatedHtml)) {
      return;
    }
    setIsReloading(true);
    window.setTimeout(() => setIsReloading(false), 500);
  }

  function handleOpenNewTab() {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  async function handleFullscreen() {
    if (!containerRef.current) {
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  }

  if (!project.generated && !generatedHtml) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-[#070A11] text-slate-200">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 text-slate-400 mb-4 shadow-inner">
          <Monitor className="size-6 text-indigo-400" aria-hidden="true" />
        </div>
        <h2 className="text-base font-bold text-white">No preview generated yet</h2>
        <p className="mt-2 max-w-sm text-xs text-slate-400 leading-relaxed">
          Describe what you want to build in the chat panel and Klyro will write the code and render a live interactive preview right here.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full min-h-0 flex-col bg-[#070A11] text-slate-200">
      {/* Browser toolbar */}
      <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-slate-800 bg-[#0B0F19] px-3">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled
          aria-label="Back"
          className="text-slate-600 hover:bg-transparent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled
          aria-label="Forward"
          className="text-slate-600 hover:bg-transparent"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleReload}
          aria-label="Reload preview"
          title="Reload preview"
          className="text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg"
        >
          <RotateCw
            className={cn("size-4", isReloading && "animate-spin text-indigo-400")}
            aria-hidden="true"
          />
        </Button>

        <p
          className="mx-2 flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-slate-800/80 bg-slate-950 px-2.5 text-xs text-slate-400 font-mono"
          aria-label={`Preview address: ${previewUrl}`}
        >
          <Lock className="size-3 shrink-0 text-emerald-400" aria-hidden="true" />
          <span className="truncate text-[11px]">{previewUrl}</span>
        </p>

        {generatedHtml && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleOpenNewTab}
            title="Open preview in new browser tab"
            aria-label="Open in new tab"
            className="text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
          </Button>
        )}

        <div
          role="group"
          aria-label="Responsive preview size"
          className="flex items-center gap-0.5 rounded-xl border border-slate-800 bg-slate-950/80 p-0.5"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewport("desktop")}
            aria-pressed={viewport === "desktop"}
            aria-label="Desktop preview"
            title="Desktop view"
            className={cn(
              "rounded-lg size-7 text-slate-400 hover:text-white hover:bg-slate-800",
              viewport === "desktop" && "bg-slate-800 text-indigo-400 shadow-xs"
            )}
          >
            <Monitor className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewport("tablet")}
            aria-pressed={viewport === "tablet"}
            aria-label="Tablet preview"
            title="Tablet view (768px)"
            className={cn(
              "rounded-lg size-7 text-slate-400 hover:text-white hover:bg-slate-800",
              viewport === "tablet" && "bg-slate-800 text-indigo-400 shadow-xs"
            )}
          >
            <Tablet className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewport("mobile")}
            aria-pressed={viewport === "mobile"}
            aria-label="Mobile preview"
            title="Mobile view (375px)"
            className={cn(
              "rounded-lg size-7 text-slate-400 hover:text-white hover:bg-slate-800",
              viewport === "mobile" && "bg-slate-800 text-indigo-400 shadow-xs"
            )}
          >
            <Smartphone className="size-3.5" aria-hidden="true" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          className="text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg"
        >
          {isFullscreen ? (
            <Minimize className="size-4" aria-hidden="true" />
          ) : (
            <Maximize className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Viewport Canvas */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-panel p-2 flex justify-center items-start bg-[#070A11]">
        <div
          className={cn(
            "bg-white transition-all duration-300",
            viewportClasses[viewport],
          )}
        >
          {isReloading ? (
            <div className="flex h-64 items-center justify-center bg-slate-950">
              <RotateCw
                className="size-5 animate-spin text-indigo-400"
                aria-hidden="true"
              />
            </div>
          ) : generatedHtml ? (
            <iframe
              srcDoc={generatedHtml}
              title="Generated preview"
              className="h-full min-h-[700px] w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            />
          ) : project.preview ? (
            <MockSite config={project.preview} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
