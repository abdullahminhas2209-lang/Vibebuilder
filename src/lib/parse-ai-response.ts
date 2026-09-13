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

import type { ChatMessageSummary, FileNode, ProjectFile, ProjectFileLanguage } from "@/lib/types";

const CODE_BLOCK_REGEX = /```([a-zA-Z0-9_+-]+)?\n([\s\S]*?)```/g;
const FILENAME_COMMENT_REGEX = /(?:\/\/|\/\*|#|<!--)\s*(?:file(?:path)?:?\s*|filename:?\s*)?([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)/i;
const PRECEDING_FILENAME_REGEX = /(?:###|\*\*|`|File:|Filename:)\s*([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)/i;
const COMPONENT_EXPORT_REGEX = /export\s+(?:default\s+)?(?:function|const|class)\s+([A-Z][a-zA-Z0-9_]*)/;

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

function cleanPath(raw: string): string {
  return raw
    .trim()
    .replace(/^[`'"*#\s]+|[`'"*#\s]+$/g, "")
    .replace(/^[./\\]+/, "")
    .replace(/\\/g, "/")
    .replace(/^src\//, "");
}

export function parseGeneratedFiles(aiResponse: string): ProjectFile[] {
  const files: ProjectFile[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  CODE_BLOCK_REGEX.lastIndex = 0;

  while ((match = CODE_BLOCK_REGEX.exec(aiResponse)) !== null) {
    const langHint = match[1] ?? "";
    const body = match[2] ?? "";
    const matchIndex = match.index;

    const lines = body.split("\n");
    let foundPath: string | null = null;
    let commentLineIndex = -1;

    // 1. Scan the first 8 lines of code block for filename comment
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const line = lines[i].trim();
      const filenameMatch = FILENAME_COMMENT_REGEX.exec(line);
      if (filenameMatch) {
        foundPath = cleanPath(filenameMatch[1]);
        commentLineIndex = i;
        break;
      }
    }

    // 2. If not found in code comments, inspect preceding markdown text (up to 250 chars)
    if (!foundPath && matchIndex > 0) {
      const precedingText = aiResponse.slice(Math.max(0, matchIndex - 250), matchIndex);
      const precedingLines = precedingText.split("\n").filter((l) => l.trim().length > 0);
      for (let i = precedingLines.length - 1; i >= 0; i--) {
        const pMatch = PRECEDING_FILENAME_REGEX.exec(precedingLines[i]);
        if (pMatch) {
          foundPath = cleanPath(pMatch[1]);
          break;
        }
      }
    }

    // 3. If still not found, inspect exported component name in body
    if (!foundPath) {
      const compMatch = COMPONENT_EXPORT_REGEX.exec(body);
      if (compMatch) {
        const compName = compMatch[1];
        if (["Page", "Home", "HomePage", "MainPage", "App"].includes(compName)) {
          foundPath = "app/page.tsx";
        } else if (compName.toLowerCase().includes("layout")) {
          foundPath = "app/layout.tsx";
        } else {
          foundPath = `components/${compName}.tsx`;
        }
      } else if (
        body.includes("export default") ||
        body.includes("function Page") ||
        body.includes("HomePage")
      ) {
        foundPath = seen.has("app/page.tsx")
          ? `components/Component${files.length + 1}.tsx`
          : "app/page.tsx";
      } else {
        // Fallback generic component
        foundPath = `components/Component${files.length + 1}.tsx`;
      }
    }

    // Normalize path
    let normalizedPath = cleanPath(foundPath);
    if (!normalizedPath.includes(".")) {
      normalizedPath += ".tsx";
    }

    // Avoid collision by appending index if already seen
    if (seen.has(normalizedPath)) {
      const ext = normalizedPath.split(".").pop() ?? "tsx";
      const base = normalizedPath.slice(0, -(ext.length + 1));
      normalizedPath = `${base}-${files.length + 1}.${ext}`;
    }
    seen.add(normalizedPath);

    const name = normalizedPath.split("/").pop() ?? normalizedPath;
    const ext = name.split(".").pop() ?? "tsx";

    // Remove the comment line if found
    const codeLines = [...lines];
    if (commentLineIndex !== -1) {
      codeLines.splice(commentLineIndex, 1);
    }
    const code = codeLines.join("\n").trim();

    files.push({
      path: normalizedPath,
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

/**
 * Generate a clean structured summary card object from the AI response and prompt
 */
export function generateSummaryFromResponse(
  prompt: string,
  aiResponse: string,
  files: ProjectFile[]
): ChatMessageSummary {
  const prose = extractProse(aiResponse);

  // 1. Determine Title
  let title = "";
  const headerMatch = prose.match(/^#{1,3}\s+(.+)$/m);
  if (headerMatch && headerMatch[1].trim()) {
    title = headerMatch[1].trim().replace(/[*_`]/g, "");
  } else {
    // Derive from prompt or default
    const cleanPrompt = prompt.trim().replace(/^build (?:a|an)?\s+/i, "").replace(/^create (?:a|an)?\s+/i, "").replace(/^design (?:a|an)?\s+/i, "");
    const words = cleanPrompt.split(/\s+/).slice(0, 6).join(" ");
    title = words.charAt(0).toUpperCase() + words.slice(1);
    if (!title.toLowerCase().includes("page") && !title.toLowerCase().includes("app") && !title.toLowerCase().includes("site")) {
      title += " Application";
    }
  }

  // 2. Determine Description
  const proseLines = prose
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("-") && !l.startsWith("*") && !/^\d+\./.test(l));
  
  let description = proseLines.slice(0, 2).join(" ");
  if (!description || description.length < 15) {
    description = `Successfully created modern responsive components and interactive live preview based on: "${prompt}".`;
  }

  // 3. Determine Features
  const features: string[] = [];
  const bulletMatches = prose.match(/^[-*•]\s+(.+)$/gm);
  if (bulletMatches && bulletMatches.length >= 2) {
    for (const b of bulletMatches.slice(0, 5)) {
      const cleanBullet = b.replace(/^[-*•]\s+/, "").replace(/[*_`]/g, "").trim();
      if (cleanBullet.length > 5) features.push(cleanBullet);
    }
  }

  // If no bullets parsed from prose, construct dynamic features from generated files
  if (features.length < 2) {
    const fileNamesLower = files.map((f) => f.name.toLowerCase());
    if (fileNamesLower.some((n) => n.includes("navbar") || n.includes("header") || n.includes("nav"))) {
      features.push("Responsive navigation bar with mobile toggle and brand assets");
    }
    if (fileNamesLower.some((n) => n.includes("hero") || n.includes("banner"))) {
      features.push("High-impact hero section with primary call-to-action buttons");
    }
    if (fileNamesLower.some((n) => n.includes("pricing") || n.includes("plan"))) {
      features.push("Interactive pricing table with tier options and feature breakdown");
    }
    if (fileNamesLower.some((n) => n.includes("feature") || n.includes("card") || n.includes("grid"))) {
      features.push("Feature showcase cards with modern hover effects");
    }
    if (fileNamesLower.some((n) => n.includes("menu") || n.includes("product") || n.includes("item"))) {
      features.push("Interactive item catalog with filter state and categorization");
    }
    if (fileNamesLower.some((n) => n.includes("footer"))) {
      features.push("Comprehensive footer with links, copyright, and social proof");
    }
    features.push("Styled with modern Tailwind CSS responsive utility classes");
    features.push("Interactive React TypeScript components with Lucide icons");
  }

  return {
    title,
    description,
    features: features.slice(0, 5),
    files: files.map((f) => f.path),
  };
}

/**
 * Format summary for storage so raw code is NEVER saved in chat history
 */
export function formatSummaryForStorage(summary: ChatMessageSummary): string {
  const parts: string[] = [];
  parts.push(`### ${summary.title}`);
  parts.push(summary.description);
  parts.push("");
  if (summary.features && summary.features.length > 0) {
    parts.push("**Features Built:**");
    for (const feat of summary.features) {
      parts.push(`- ${feat}`);
    }
    parts.push("");
  }
  if (summary.files && summary.files.length > 0) {
    parts.push("**Generated Files:**");
    for (const file of summary.files) {
      parts.push(`- \`${file}\``);
    }
  }
  return parts.join("\n");
}

/**
 * Parse an existing formatted summary from message content
 */
export function parseSummaryFromContent(content: string): ChatMessageSummary | null {
  if (!content) return null;
  // If content contains raw code fence, strip it immediately!
  const clean = extractProse(content);
  if (!clean.includes("**Features Built:**") && !clean.startsWith("### ")) {
    return null;
  }

  const lines = clean.split("\n").map((l) => l.trim());
  let title = "Generated Application";
  let description = "";
  const features: string[] = [];
  const files: string[] = [];

  let section: "desc" | "features" | "files" = "desc";

  for (const line of lines) {
    if (line.startsWith("### ")) {
      title = line.replace("### ", "").trim();
      continue;
    }
    if (line.includes("**Features Built:**")) {
      section = "features";
      continue;
    }
    if (line.includes("**Generated Files:**")) {
      section = "files";
      continue;
    }
    if (section === "desc" && line.length > 0) {
      description = description ? `${description} ${line}` : line;
    } else if (section === "features" && line.startsWith("- ")) {
      features.push(line.replace("- ", "").trim());
    } else if (section === "files" && line.startsWith("- ")) {
      files.push(line.replace("- ", "").replace(/`/g, "").trim());
    }
  }

  return {
    title,
    description: description || "Components and preview generated successfully.",
    features: features.length > 0 ? features : ["Component generation complete"],
    files,
  };
}
