"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { highlightCodeLine } from "@/lib/highlight";
import type { ProjectFile } from "@/lib/types";

export function CodePanel({ file }: { file: ProjectFile | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <h2 className="text-sm font-semibold">No file selected</h2>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
          Select a file in the explorer to view its source code.
        </p>
      </div>
    );
  }

  // Captured so the copy handler below keeps a non-nullable reference.
  const currentFile = file;
  const lines = currentFile.code.replace(/\n$/, "").split("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); ignore.
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-4">
        <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">
          {currentFile.path}
        </p>
        <Badge variant="secondary" className="ml-auto shrink-0 text-[10px] uppercase">
          {currentFile.language}
        </Badge>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : `Copy contents of ${currentFile.path}`}
        >
          {copied ? (
            <Check className="size-4 text-primary" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto scrollbar-panel">
        <pre className="min-w-max px-0 py-3 font-mono text-[13px] leading-6">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex hover:bg-accent/40">
                <span
                  aria-hidden="true"
                  className="w-12 shrink-0 pr-4 text-right text-muted-foreground/60 select-none"
                >
                  {index + 1}
                </span>
                <span className="whitespace-pre">{highlightCodeLine(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
