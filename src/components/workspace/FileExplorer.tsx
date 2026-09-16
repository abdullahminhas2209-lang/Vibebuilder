"use client";

import { useState } from "react";
import {
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
} from "lucide-react";

import type { FileNode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export function FileExplorer({ nodes, selectedPath, onSelect }: FileExplorerProps) {
  // Every folder starts expanded — the example tree is small and this is
  // the most useful default for a generated project.
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(nodes.filter((node) => node.type === "folder").map((node) => node.path)),
  );

  function toggleFolder(path: string) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  function renderNodes(nodes: FileNode[], depth: number) {
    return nodes.map((node) => {
      if (node.type === "folder") {
        const isExpanded = expanded.has(node.path);
        const isEmpty = !node.children || node.children.length === 0;

        return (
          <li key={node.path}>
            <button
              type="button"
              onClick={() => toggleFolder(node.path)}
              aria-expanded={isExpanded}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-sm py-1.5 text-xs text-fog font-mono transition-colors hover:bg-ink-raised hover:text-cream focus-visible:ring-1 focus-visible:ring-amber/50 focus-visible:outline-none",
                depth === 0 ? "px-2" : "",
              )}
              style={depth > 0 ? { paddingLeft: `${depth * 14 + 8}px` } : undefined}
            >
              <ChevronRight
                className={cn(
                  "size-3.5 shrink-0 text-fog-dim transition-transform duration-200 ease-out",
                  isExpanded && "rotate-90",
                )}
                aria-hidden="true"
              />
              {isExpanded ? (
                <FolderOpen className="size-4 shrink-0 text-amber" aria-hidden="true" />
              ) : (
                <Folder className="size-4 shrink-0 text-fog" aria-hidden="true" />
              )}
              <span className="truncate font-mono font-medium">{node.name}</span>
            </button>
            {isExpanded && (
              <ul>
                {isEmpty ? (
                  <li
                    className="py-1 text-[11px] text-fog-dim italic font-mono"
                    style={{ paddingLeft: `${(depth + 1) * 14 + 30}px` }}
                  >
                    Empty
                  </li>
                ) : (
                  renderNodes(node.children ?? [], depth + 1)
                )}
              </ul>
            )}
          </li>
        );
      }

      const isSelected = node.path === selectedPath;

      return (
        <li key={node.path}>
          <button
            type="button"
            onClick={() => onSelect(node.path)}
            aria-current={isSelected ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-sm py-1.5 text-xs font-mono transition-all focus-visible:ring-1 focus-visible:ring-amber/50 focus-visible:outline-none",
              isSelected
                ? "bg-amber/15 text-amber border border-amber/30 font-medium shadow-xs"
                : "text-fog hover:bg-ink-raised hover:text-cream border border-transparent",
            )}
            style={{ paddingLeft: `${depth * 14 + 30}px`, paddingRight: "8px" }}
          >
            <FileCode2
              className={cn("size-3.5 shrink-0", isSelected ? "text-amber" : "text-fog-dim")}
              aria-hidden="true"
            />
            <span className="truncate font-mono">{node.name}</span>
          </button>
        </li>
      );
    });
  }

  return (
    <ul role="tree" aria-label="Project files" className="space-y-0.5">
      {renderNodes(nodes, 0)}
    </ul>
  );
}
