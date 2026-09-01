/**
 * Parses AI response text to extract generated code files.
 * Looks for fenced code blocks with a filename comment on the first line.
 *
 * Example block the AI produces:
 *   ```tsx
 *   // app/page.tsx
 *   export default function Page() { ... }
 *   ```
 */

import type { ProjectFile, ProjectFileLanguage } from "@/lib/types";

const CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g;
const FILENAME_COMMENT_REGEX = /^\/\/\s*(.+\.\w+)/;

function inferLanguage(
  ext: string,
  hint?: string
): ProjectFileLanguage {
  const combined = (hint ?? ext).toLowerCase();
  if (combined === "tsx" || ext === "tsx") return "tsx";
  if (combined === "ts" || ext === "ts") return "ts";
  if (combined === "css" || ext === "css") return "css";
  if (combined === "json" || ext === "json") return "json";
  return "tsx"; // default
}

export function parseGeneratedFiles(aiResponse: string): ProjectFile[] {
  const files: ProjectFile[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  CODE_BLOCK_REGEX.lastIndex = 0;

  while ((match = CODE_BLOCK_REGEX.exec(aiResponse)) !== null) {
    const langHint = match[1] ?? "";
    const body = match[2] ?? "";

    const firstLine = body.split("\n")[0] ?? "";
    const filenameMatch = FILENAME_COMMENT_REGEX.exec(firstLine.trim());
    if (!filenameMatch) continue;

    const path = filenameMatch[1].trim();
    if (seen.has(path)) continue;
    seen.add(path);

    const ext = path.split(".").pop() ?? "tsx";
    const name = path.split("/").pop() ?? path;
    const code = body.replace(/^.*\n/, ""); // strip filename comment line

    files.push({
      path,
      name,
      language: inferLanguage(ext, langHint),
      code,
    });
  }

  return files;
}

/**
 * Converts a flat list of ProjectFiles into a FileNode tree
 * suitable for the FileExplorer component.
 */
import type { FileNode } from "@/lib/types";

export function buildFileTree(files: ProjectFile[]): FileNode[] {
  const root: FileNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      let folder = current.find(
        (n) => n.type === "folder" && n.name === folderName
      );
      if (!folder) {
        const folderPath = parts.slice(0, i + 1).join("/");
        folder = { name: folderName, path: folderPath, type: "folder", children: [] };
        current.push(folder);
      }
      current = folder.children!;
    }

    current.push({
      name: file.name,
      path: file.path,
      type: "file",
      language: file.language,
    });
  }

  return root;
}

/** Strip the AI explanation text, return only prose (non-code) content. */
export function extractProse(aiResponse: string): string {
  return aiResponse.replace(/```[\s\S]*?```/g, "").trim();
}
