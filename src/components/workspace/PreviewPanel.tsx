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

import { LogoMark } from "@/components/brand/Logo";
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
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-ink text-cream font-sans">
        <div className="flex size-14 items-center justify-center rounded-md border border-dashed border-slate-line bg-ink-raised/60 text-amber mb-4 shadow-inner">
          <Monitor className="size-6 text-amber" aria-hidden="true" />
        </div>
        <h2 className="text-base font-serif font-semibold text-cream">No preview generated yet</h2>
        <p className="mt-2 max-w-sm text-xs text-fog leading-relaxed font-sans">
          Describe what you want to build in the chat panel and Klyro will write the code and render a live interactive preview right here.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full min-h-0 flex-col bg-ink text-cream font-sans">
      {/* Browser toolbar */}
      <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-slate-line bg-ink px-3">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled
          aria-label="Back"
          className="text-fog-dim hover:bg-transparent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled
          aria-label="Forward"
          className="text-fog-dim hover:bg-transparent"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleReload}
          aria-label="Reload preview"
          title="Reload preview"
          className="text-fog hover:text-cream hover:bg-ink-raised rounded-sm"
        >
          <RotateCw
            className={cn("size-4", isReloading && "animate-spin text-amber")}
            aria-hidden="true"
          />
        </Button>

        <p
          className="mx-2 flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-sm border border-slate-line bg-ink-raised px-2.5 text-xs text-fog font-mono"
          aria-label={`Preview address: ${previewUrl}`}
        >
          <Lock className="size-3 shrink-0 text-amber" aria-hidden="true" />
          <span className="truncate text-[11px]">{previewUrl}</span>
        </p>

        {generatedHtml && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleOpenNewTab}
            title="Open preview in new browser tab"
            aria-label="Open in new tab"
            className="text-fog hover:text-cream hover:bg-ink-raised rounded-sm"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
          </Button>
        )}

        <div
          role="group"
          aria-label="Responsive preview size"
          className="flex items-center gap-0.5 rounded-sm border border-slate-line bg-ink-raised p-0.5"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewport("desktop")}
            aria-pressed={viewport === "desktop"}
            aria-label="Desktop preview"
            title="Desktop view"
            className={cn(
              "rounded-sm size-7 text-fog hover:text-cream hover:bg-ink",
              viewport === "desktop" && "bg-amber text-[#14161f] font-semibold shadow-xs"
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
              "rounded-sm size-7 text-fog hover:text-cream hover:bg-ink",
              viewport === "tablet" && "bg-amber text-[#14161f] font-semibold shadow-xs"
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
              "rounded-sm size-7 text-fog hover:text-cream hover:bg-ink",
              viewport === "mobile" && "bg-amber text-[#14161f] font-semibold shadow-xs"
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
          className="text-fog hover:text-cream hover:bg-ink-raised rounded-sm"
        >
          {isFullscreen ? (
            <Minimize className="size-4" aria-hidden="true" />
          ) : (
            <Maximize className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Viewport Canvas */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-panel p-2 flex justify-center items-start bg-ink">
        <div
          className={cn(
            "bg-ink transition-all duration-300",
            viewportClasses[viewport],
          )}
        >
          {isReloading ? (
            <div className="flex h-64 items-center justify-center bg-ink">
              <RotateCw
                className="size-5 animate-spin text-amber"
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
          ) : (
            <div className="flex min-h-[600px] w-full flex-col items-center justify-center p-8 text-center bg-ink text-cream">
              <div className="relative mb-4 flex size-14 items-center justify-center rounded-md border border-slate-line bg-ink-raised shadow-inner">
                <LogoMark size={28} />
              </div>
              <h3 className="text-base font-serif font-semibold text-cream">Live Sandbox Initializing</h3>
              <p className="mt-2 max-w-sm text-xs text-fog leading-relaxed font-sans">
                Describe what to build in chat and your live interactive preview will compile here in real-time.
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-sm border border-slate-line bg-ink-raised px-3 py-1 font-mono text-[11px] text-fog">
                <span className="size-2 rounded-full bg-amber animate-pulse" />
                <span>Compiler Sandbox Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
