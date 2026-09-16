import type { ProjectFile } from "@/lib/types";

/**
 * Sample source for the "SaaS Analytics Dashboard" project (Pulseboard).
 * Phase 1 only: display data for the code panel, not a real file system.
 */
export const saasFiles: ProjectFile[] = [
  {
    path: "app/page.tsx",
    name: "page.tsx",
    language: "tsx",
    code: `import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MetricCard } from "@/components/MetricCard";
import { UsageChart } from "@/components/UsageChart";

const metrics = [
  { label: "Active users", value: "12,480", delta: "+8.2%" },
  { label: "API requests", value: "1.2M", delta: "+12.4%" },
  { label: "Error rate", value: "0.14%", delta: "-0.03%" },
  { label: "MRR", value: "$28.4k", delta: "+4.1%" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-ink text-cream font-sans">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8">
          <h1 className="font-serif text-2xl font-semibold text-cream">Overview</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
          <UsageChart />
        </main>
      </div>
    </div>
  );
}
`,
  },
  {
    path: "app/layout.tsx",
    name: "layout.tsx",
    language: "tsx",
    code: `import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pulseboard — Product analytics",
  description: "Usage analytics with charts, filters, and team settings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.className}>{children}</body>
    </html>
  );
}
`,
  },
  {
    path: "app/globals.css",
    name: "globals.css",
    language: "css",
    code: `@import "tailwindcss";

:root {
  --ink: #14161f;
  --ink-raised: #1c1f2b;
  --amber: #f2a93b;
  --cream: #f2f0e8;
  --fog: #9aa0ae;
  --slate-line: #2b2f3c;
}

body {
  background: var(--ink);
  color: var(--cream);
}
`,
  },
  {
    path: "components/MetricCard.tsx",
    name: "MetricCard.tsx",
    language: "tsx",
    code: `interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
}

export function MetricCard({ label, value, delta }: MetricCardProps) {
  const positive = delta.startsWith("+");

  return (
    <div className="rounded-md border border-slate-line bg-ink-raised p-5 transition-all hover:border-amber/40">
      <p className="font-mono text-xs uppercase tracking-wider text-fog-dim">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="font-mono text-2xl font-bold text-cream">{value}</p>
        <span className={positive ? "font-mono text-xs font-medium text-amber" : "font-mono text-xs font-medium text-rose-400"}>
          {delta}
        </span>
      </div>
    </div>
  );
}
`,
  },
  {
    path: "components/UsageChart.tsx",
    name: "UsageChart.tsx",
    language: "tsx",
    code: `const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const values = [42, 58, 51, 74, 68, 35, 48];

export function UsageChart() {
  return (
    <div className="mt-8 rounded-md border border-slate-line bg-ink-raised p-6">
      <div className="flex items-center justify-between border-b border-slate-line pb-3">
        <h2 className="font-serif font-semibold text-cream">API requests</h2>
        <span className="font-mono text-xs text-fog-dim">Last 7 days</span>
      </div>
      <div className="mt-6 flex h-40 items-end gap-3">
        {values.map((value, index) => (
          <div key={days[index]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-sm bg-amber/80 transition-all hover:bg-amber"
              style={{ height: value + "%" }}
            />
            <span className="font-mono text-xs text-fog">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
  },
  {
    path: "components/Sidebar.tsx",
    name: "Sidebar.tsx",
    language: "tsx",
    code: `const items = ["Overview", "Traffic", "Retention", "Revenue", "Settings"];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-line bg-ink-raised p-4 md:block">
      <div className="flex items-center gap-2 px-2 py-1">
        <span className="flex size-6 items-center justify-center rounded-sm bg-amber text-[#14161f] font-mono font-bold text-xs">P</span>
        <p className="font-serif text-sm font-semibold text-cream">Pulseboard</p>
      </div>
      <nav className="mt-6 space-y-1">
        {items.map((item, index) => (
          <p
            key={item}
            className={
              index === 0
                ? "rounded-sm bg-amber text-[#14161f] px-3 py-1.5 font-mono text-xs font-semibold cursor-pointer"
                : "rounded-sm px-3 py-1.5 font-mono text-xs text-fog hover:text-cream hover:bg-ink cursor-pointer transition-colors"
            }
          >
            {item}
          </p>
        ))}
      </nav>
    </aside>
  );
}
`,
  },
  {
    path: "components/Topbar.tsx",
    name: "Topbar.tsx",
    language: "tsx",
    code: `export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-line bg-ink px-6">
      <input
        readOnly
        className="w-64 rounded-sm border border-slate-line bg-ink-raised px-3 py-1.5 font-mono text-xs text-cream placeholder:text-fog-dim focus:outline-none"
        placeholder="Search metrics..."
      />
      <div className="flex items-center gap-3">
        <span className="font-sans text-xs text-fog">Acme Inc</span>
        <span className="flex size-7 items-center justify-center rounded-sm bg-amber text-xs font-bold font-mono text-[#14161f]">
          AR
        </span>
      </div>
    </header>
  );
}
`,
  },
];
