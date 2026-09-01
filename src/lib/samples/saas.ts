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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
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
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>{children}</body>
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
  --brand: oklch(0.51 0.19 277);
  --surface: oklch(0.98 0.003 260);
  --ink: oklch(0.21 0.02 262);
}

body {
  background: var(--surface);
  color: var(--ink);
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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <span className={positive ? "text-emerald-600" : "text-rose-600"}>
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
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">API requests</h2>
        <span className="text-sm text-slate-500">Last 7 days</span>
      </div>
      <div className="mt-6 flex h-40 items-end gap-3">
        {values.map((value, index) => (
          <div key={days[index]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-indigo-500/80"
              style={{ height: value + "%" }}
            />
            <span className="text-xs text-slate-400">{days[index]}</span>
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
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <p className="px-2 text-sm font-semibold text-slate-900">Pulseboard</p>
      <nav className="mt-4 space-y-1">
        {items.map((item, index) => (
          <p
            key={item}
            className={
              index === 0
                ? "rounded-lg bg-indigo-50 px-2 py-1.5 text-sm font-medium text-indigo-700"
                : "rounded-lg px-2 py-1.5 text-sm text-slate-600"
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
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <input
        readOnly
        className="w-64 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm"
        placeholder="Search metrics..."
      />
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Acme Inc</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          AR
        </span>
      </div>
    </header>
  );
}
`,
  },
];
