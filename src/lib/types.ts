import type { LucideIcon } from "lucide-react";

/** Lifecycle status shown on project cards and in the workspace header. */
export type ProjectStatus = "draft" | "active" | "updated";

/**
 * Preview configuration for generated mock projects. Each project renders
 * its own themed static preview site in the workspace preview panel.
 */
export interface MockPreviewAccent {
  /** Primary button classes, e.g. "bg-indigo-500 text-white". */
  primaryButton: string;
  /** Accent text on dark surfaces, e.g. "text-indigo-300". */
  accentText: string;
  /** Dark hero/panel background, e.g. "bg-slate-950". */
  darkSurface: string;
  /** Light accent section background, e.g. "bg-indigo-50". */
  softSurface: string;
  /** Card/product swatch gradient, e.g. "from-indigo-200 to-slate-100". */
  swatch: string;
  /** Hex stroke color for the dashboard usage chart. */
  chartStroke?: string;
}

export interface MockPreviewBase {
  brand: string;
  nav: string[];
  /** Label for the navbar call-to-action button. */
  navCta: string;
  accent: MockPreviewAccent;
  footerLinks: string[];
  footerNote: string;
}

export interface MarketingPreview extends MockPreviewBase {
  variant: "marketing";
  badge: string;
  headline: string;
  subtext: string;
  primaryCta: string;
  secondaryCta: string;
  sectionTitle: string;
  cards: { title: string; meta: string }[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
}

export interface DashboardPreview extends MockPreviewBase {
  variant: "dashboard";
  metrics: { label: string; value: string; delta: string }[];
  chartTitle: string;
  activity: { label: string; value: string }[];
}

export interface StorePreview extends MockPreviewBase {
  variant: "store";
  headline: string;
  subtext: string;
  products: { name: string; price: string }[];
  ctaTitle: string;
  ctaButton: string;
}

export type MockPreviewConfig =
  | MarketingPreview
  | DashboardPreview
  | StorePreview;

export interface Project {
  id: string;
  name: string;
  description: string;
  /** Human-readable project type, e.g. "Restaurant website". */
  type: string;
  status: ProjectStatus;
  /** Pre-formatted relative time, e.g. "2 hours ago". */
  lastUpdated: string;
  /** Pre-formatted absolute date, e.g. "Aug 12, 2026". */
  createdAt: string;
  /** Whether the workspace starts with generated files and a live preview. */
  generated: boolean;
  /** Static preview site configuration for generated projects. */
  preview?: MockPreviewConfig;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Pre-formatted display time, e.g. "9:41 AM". */
  createdAt: string;
  /** Working indicator shown while the mock assistant is responding. */
  pending?: boolean;
}

export type ProjectFileLanguage = "tsx" | "ts" | "css" | "json";

export interface ProjectFile {
  /** Path relative to the project root, e.g. "app/page.tsx". */
  path: string;
  name: string;
  language: ProjectFileLanguage;
  code: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  language?: ProjectFileLanguage;
  children?: FileNode[];
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional short description shown in the mobile navigation. */
  description?: string;
}

export interface User {
  name: string;
  email: string;
  initials: string;
}
