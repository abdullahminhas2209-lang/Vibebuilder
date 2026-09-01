import type { ProjectFile } from "@/lib/types";

/**
 * Builders for the boilerplate files every sample project shares.
 * Keeps each sample module focused on its distinctive source files.
 */
export function makeLayout(brand: string, title: string, description: string): ProjectFile {
  return {
    path: "app/layout.tsx",
    name: "layout.tsx",
    language: "tsx",
    code: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`,
  };
}

export function makeGlobals(
  brand: string,
  surface: string,
  ink: string,
): ProjectFile {
  return {
    path: "app/globals.css",
    name: "globals.css",
    language: "css",
    code: `@import "tailwindcss";

:root {
  --brand: ${brand};
  --surface: ${surface};
  --ink: ${ink};
}

body {
  background: var(--surface);
  color: var(--ink);
}
`,
  };
}

export function makeFooter(
  brand: string,
  links: string[],
  note: string,
): ProjectFile {
  return {
    path: "components/Footer.tsx",
    name: "Footer.tsx",
    language: "tsx",
    code: `export function Footer() {
  return (
    <footer className="border-t border-stone-200 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">${brand}</p>
        <nav className="flex gap-6 text-sm text-stone-500">
${links.map((link) => `          <a href="#">${link}</a>`).join("\n")}
        </nav>
        <p className="text-sm text-stone-400">
          &copy; 2026 ${brand}
        </p>
      </div>
    </footer>
  );
}
`,
  };
}
