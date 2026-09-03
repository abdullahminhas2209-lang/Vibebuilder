import JSZip from "jszip";
import type { ProjectFile } from "@/lib/types";

/**
 * Packages all project files into a complete, ready-to-run Next.js ZIP archive.
 */
export async function downloadProjectZip(projectName: string, files: ProjectFile[]) {
  const zip = new JSZip();
  const safeProjectSlug = (projectName || "vibebuilder-project")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Add all project files into the zip
  const hasAppLayout = files.some((f) => f.path === "app/layout.tsx" || f.path === "src/app/layout.tsx");
  const hasGlobalsCss = files.some((f) => f.path.endsWith("globals.css"));
  const hasUtils = files.some((f) => f.path.includes("utils.ts") || f.path.includes("utils.js"));

  files.forEach((file) => {
    zip.file(file.path, file.code || "");
  });

  // Standard Next.js package.json
  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: safeProjectSlug,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          next: "^14.2.5",
          "lucide-react": "^0.453.0",
          clsx: "^2.1.1",
          "tailwind-merge": "^2.5.4",
          "class-variance-authority": "^0.7.0",
        },
        devDependencies: {
          typescript: "^5.5.4",
          "@types/node": "^20.14.10",
          "@types/react": "^18.3.3",
          "@types/react-dom": "^18.3.0",
          postcss: "^8.4.39",
          tailwindcss: "^3.4.6",
          autoprefixer: "^10.4.19",
        },
      },
      null,
      2
    )
  );

  // Standard tsconfig.json
  zip.file(
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: {
            "@/*": ["./*"],
          },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2
    )
  );

  // Tailwind config
  zip.file(
    "tailwind.config.ts",
    `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
`
  );

  // Postcss config
  zip.file(
    "postcss.config.mjs",
    `const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
`
  );

  // Add layout if not generated
  if (!hasAppLayout) {
    zip.file(
      "app/layout.tsx",
      `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName || "VibeBuilder Generated App"}",
  description: "Built with VibeBuilder AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
`
    );
  }

  // Add globals.css if not generated
  if (!hasGlobalsCss) {
    zip.file(
      "app/globals.css",
      `@tailwind base;
@tailwind components;
@tailwind utilities;
`
    );
  }

  // Add lib/utils.ts if not generated
  if (!hasUtils) {
    zip.file(
      "lib/utils.ts",
      `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
    );
  }

  // README.md
  zip.file(
    "README.md",
    `# ${projectName || "VibeBuilder Project"}

This application was generated with **VibeBuilder AI**.

## 🚀 Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the local development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
`
  );

  // Generate zip file and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${safeProjectSlug}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
