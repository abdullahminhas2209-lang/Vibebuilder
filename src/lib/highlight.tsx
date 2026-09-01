import type { ReactNode } from "react";

/**
 * Lightweight, dependency-free tokenizer used by the code panel to render
 * syntax-like highlighting for the static example files.
 *
 * This is intentionally NOT a real parser: Phase 1 only needs a readable,
 * colored code view for a handful of known TSX/CSS files.
 */

const TOKEN_PATTERN = new RegExp(
  [
    "(\\/\\/[^\\n]*)", // line comments
    "(\"[^\"]*\"|'[^']*'|`[^`]*`)", // strings
    "(<\\/?[A-Za-z][\\w.-]*)", // JSX tags
    "\\b(import|from|export|default|const|let|var|function|return|if|else|await|async|new|type|interface|extends|as|true|false|null|undefined)\\b", // keywords
    "(\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|s|ms)?\\b)", // numbers
  ].join("|"),
  "g",
);

const TOKEN_CLASSES = [
  "text-muted-foreground italic", // comment
  "text-emerald-600", // string
  "text-sky-700", // JSX tag
  "text-violet-700", // keyword
  "text-amber-600", // number
] as const;

interface Token {
  text: string;
  className?: string;
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, index) });
    }

    const groupIndex = match.slice(1).findIndex((value) => value !== undefined);
    tokens.push({
      text: match[0],
      className: groupIndex >= 0 ? TOKEN_CLASSES[groupIndex] : undefined,
    });

    lastIndex = index + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex) });
  }

  return tokens;
}

/** Renders one line of code as highlighted spans. */
export function highlightCodeLine(line: string): ReactNode {
  const tokens = tokenizeLine(line);

  return (
    <span>
      {tokens.map((token, index) =>
        token.className ? (
          <span key={index} className={token.className}>
            {token.text}
          </span>
        ) : (
          <span key={index}>{token.text}</span>
        ),
      )}
    </span>
  );
}
