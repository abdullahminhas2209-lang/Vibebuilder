import { getSampleFiles } from "@/lib/code-samples";
import type {
  ChatMessage,
  FileNode,
  MockPreviewConfig,
  Project,
  ProjectFile,
  User,
} from "@/lib/types";

/**
 * Centralized mock data for Phase 1. Everything the UI renders comes from
 * this file so it can later be swapped for real API/database responses
 * without touching components. Each mock project owns its own preview
 * configuration, sample source files, and chat seed.
 */

export const mockUser: User = {
  name: "Alex Rivera",
  email: "alex@vibebuilder.app",
  initials: "AR",
};

/** Id used by the "New Project" action. Renders an empty workspace. */
export const demoProjectId = "demo";

export const projects: Project[] = [
  {
    id: "restaurant-booking",
    name: "Restaurant Booking",
    description:
      "Modern restaurant site with menu, reservations, and contact.",
    type: "Restaurant website",
    status: "active",
    lastUpdated: "2 hours ago",
    createdAt: "Aug 12, 2026",
    generated: true,
  },
  {
    id: "saas-analytics",
    name: "SaaS Analytics Dashboard",
    description: "Usage analytics with charts, filters, and team settings.",
    type: "Web app",
    status: "updated",
    lastUpdated: "Yesterday",
    createdAt: "Jul 28, 2026",
    generated: true,
  },
  {
    id: "personal-portfolio",
    name: "Personal Portfolio",
    description: "Developer portfolio with projects, writing, and contact.",
    type: "Portfolio site",
    status: "updated",
    lastUpdated: "3 days ago",
    createdAt: "Jul 19, 2026",
    generated: true,
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    description: "Storefront with product grid, cart, and checkout flow.",
    type: "Online store",
    status: "draft",
    lastUpdated: "Last week",
    createdAt: "Jul 8, 2026",
    generated: true,
  },
  {
    id: "fitness-landing",
    name: "Fitness Landing Page",
    description:
      "High-conversion landing page for a fitness coaching studio.",
    type: "Landing page",
    status: "active",
    lastUpdated: "2 weeks ago",
    createdAt: "Jun 30, 2026",
    generated: true,
  },
];

/** Workspace target for "New Project". Starts empty (not generated yet). */
export const demoProject: Project = {
  id: demoProjectId,
  name: "Untitled Project",
  description: "A blank workspace waiting for your first prompt.",
  type: "New project",
  status: "draft",
  lastUpdated: "Just now",
  createdAt: "Today",
  generated: false,
};

export function getProjectById(id: string): Project | undefined {
  if (id === demoProjectId) {
    return demoProject;
  }
  const project = projects.find((entry) => entry.id === id);
  if (!project) {
    return undefined;
  }
  return { ...project, preview: previewConfigs[project.id] };
}

/**
 * Static preview-site configuration per generated project. Rendered by
 * components/workspace/MockSite.tsx — purely visual, no real functionality.
 */
export const previewConfigs: Record<string, MockPreviewConfig> = {
  "restaurant-booking": {
    variant: "marketing",
    brand: "Ember & Oak",
    nav: ["Menu", "Our story", "Private dining", "Contact"],
    navCta: "Reserve a table",
    accent: {
      primaryButton: "bg-amber-500 text-stone-950",
      accentText: "text-amber-300",
      darkSurface: "bg-stone-950",
      softSurface: "bg-amber-50",
      swatch: "from-amber-200 to-orange-100",
    },
    badge: "Wood-fired kitchen · Portland",
    headline: "Seasonal cooking, warm hospitality.",
    subtext:
      "A neighborhood restaurant serving live-fire dishes made from locally grown produce and a cellar of low-intervention wines.",
    primaryCta: "Book a table",
    secondaryCta: "View the menu",
    sectionTitle: "Featured dishes",
    cards: [
      { title: "Charred octopus", meta: "$24 · Nduja, lemon, herbs" },
      { title: "Dry-aged ribeye", meta: "$58 · Bone marrow butter" },
      { title: "Wood-oven flatbread", meta: "$18 · Ricotta, hot honey" },
    ],
    ctaTitle: "Reserve your evening",
    ctaBody:
      "Tables are released 30 days in advance. Walk-ins always welcome at the bar.",
    ctaButton: "Check availability",
    footerLinks: ["Instagram", "Private events", "Careers"],
    footerNote: "© 2026 Ember & Oak",
  },
  "saas-analytics": {
    variant: "dashboard",
    brand: "Pulseboard",
    nav: ["Overview", "Traffic", "Retention", "Revenue"],
    navCta: "Invite team",
    accent: {
      primaryButton: "bg-indigo-500 text-white",
      accentText: "text-indigo-300",
      darkSurface: "bg-slate-950",
      softSurface: "bg-indigo-50",
      swatch: "from-indigo-200 to-slate-100",
      chartStroke: "#6366f1",
    },
    metrics: [
      { label: "Active users", value: "12,480", delta: "+8.2%" },
      { label: "MRR", value: "$48.2k", delta: "+5.4%" },
      { label: "Churn", value: "1.9%", delta: "-0.3%" },
      { label: "NPS", value: "62", delta: "+4" },
    ],
    chartTitle: "Weekly active users",
    activity: [
      { label: "Acme Corp upgraded to Scale", value: "2m ago" },
      { label: "New API keys issued", value: "18m ago" },
      { label: "Globex invited 6 teammates", value: "1h ago" },
      { label: "Initech enabled SSO", value: "3h ago" },
    ],
    footerLinks: ["Status", "Docs", "Support"],
    footerNote: "© 2026 Pulseboard",
  },
  "personal-portfolio": {
    variant: "marketing",
    brand: "jordanlee.dev",
    nav: ["Projects", "Writing", "About", "Contact"],
    navCta: "Get in touch",
    accent: {
      primaryButton: "bg-emerald-500 text-stone-950",
      accentText: "text-emerald-300",
      darkSurface: "bg-stone-950",
      softSurface: "bg-emerald-50",
      swatch: "from-emerald-200 to-teal-100",
    },
    badge: "Software engineer · Berlin",
    headline: "Building fast, thoughtful web products.",
    subtext:
      "Independent engineer focused on developer tooling, design systems, and the small details that make software feel effortless.",
    primaryCta: "View projects",
    secondaryCta: "Read the blog",
    sectionTitle: "Featured projects",
    cards: [
      { title: "Taskflow", meta: "Realtime project board · React, CRDTs" },
      { title: "Pathfinder", meta: "Type-safe routing library · 4k stars" },
      { title: "Snips", meta: "Snippet manager CLI · Rust" },
    ],
    ctaTitle: "Let's build something together",
    ctaBody:
      "Currently open to select freelance work and long-term collaborations.",
    ctaButton: "Email me",
    footerLinks: ["Projects", "Writing", "Contact"],
    footerNote: "© 2026 Jordan Lee",
  },
  "ecommerce-store": {
    variant: "store",
    brand: "Northwind Goods",
    nav: ["Shop", "Collections", "Journal", "About"],
    navCta: "Shop now",
    accent: {
      primaryButton: "bg-teal-600 text-white",
      accentText: "text-teal-200",
      darkSurface: "bg-stone-900",
      softSurface: "bg-teal-50",
      swatch: "from-teal-100 to-sky-100",
    },
    headline: "Everyday goods, made to last.",
    subtext:
      "Durable homeware and carry goods sourced from small workshops. Free shipping over $75 and 60-day returns.",
    products: [
      { name: "Waxed canvas tote", price: "$38" },
      { name: "Ceramic pour-over set", price: "$64" },
      { name: "Merino wool throw", price: "$89" },
    ],
    ctaTitle: "New arrivals every season",
    ctaButton: "Browse the shop",
    footerLinks: ["Shipping", "Returns", "Contact"],
    footerNote: "© 2026 Northwind Goods",
  },
  "fitness-landing": {
    variant: "marketing",
    brand: "Forge Fitness",
    nav: ["Programs", "Coaching", "Schedule", "Pricing"],
    navCta: "Start free week",
    accent: {
      primaryButton: "bg-orange-500 text-white",
      accentText: "text-orange-300",
      darkSurface: "bg-zinc-950",
      softSurface: "bg-orange-50",
      swatch: "from-orange-200 to-amber-100",
    },
    badge: "Strength coaching · Austin",
    headline: "Train with purpose. Progress you can measure.",
    subtext:
      "Small-group barbell coaching with written programming, quarterly testing, and nutrition guidance built in.",
    primaryCta: "Start free week",
    secondaryCta: "See programs",
    sectionTitle: "Coaching programs",
    cards: [
      { title: "Foundations", meta: "6-week strength basics · 3x/week" },
      { title: "Performance", meta: "Barbell club · 4x/week + programming" },
      { title: "Hybrid", meta: "Strength + conditioning · 5x/week" },
    ],
    ctaTitle: "Ready to start?",
    ctaBody:
      "Your first week is free — tour the gym, meet a coach, and get your movement assessment.",
    ctaButton: "Claim your free week",
    footerLinks: ["Schedule", "Pricing", "FAQ"],
    footerNote: "© 2026 Forge Fitness",
  },
};

// ---------------------------------------------------------------------------
// Chat seeds — the conversation each generated workspace starts with.
// ---------------------------------------------------------------------------

const chatSeeds: Record<string, ChatMessage[]> = {
  "restaurant-booking": [
    {
      id: "seed-restaurant-user",
      role: "user",
      content: "Build a modern restaurant website with online reservations.",
      createdAt: "9:41 AM",
    },
    {
      id: "seed-restaurant-assistant",
      role: "assistant",
      content:
        "I'll help structure the restaurant experience with a homepage, menu section, reservation flow, and contact information.",
      createdAt: "9:41 AM",
    },
  ],
  "saas-analytics": [
    {
      id: "seed-saas-user",
      role: "user",
      content:
        "Create an analytics dashboard with usage metrics and a team settings page.",
      createdAt: "2:07 PM",
    },
    {
      id: "seed-saas-assistant",
      role: "assistant",
      content:
        "I'll scaffold the dashboard shell with metric cards, a usage chart, recent activity, and a settings layout.",
      createdAt: "2:07 PM",
    },
  ],
  "personal-portfolio": [
    {
      id: "seed-portfolio-user",
      role: "user",
      content:
        "Build a minimal developer portfolio with a projects grid and a writing section.",
      createdAt: "11:23 AM",
    },
    {
      id: "seed-portfolio-assistant",
      role: "assistant",
      content:
        "I'll set up a homepage with a short bio, featured projects, recent writing, and a contact link.",
      createdAt: "11:23 AM",
    },
  ],
  "ecommerce-store": [
    {
      id: "seed-ecommerce-user",
      role: "user",
      content: "Design a storefront for a homeware brand with a product grid and cart.",
      createdAt: "4:55 PM",
    },
    {
      id: "seed-ecommerce-assistant",
      role: "assistant",
      content:
        "I'll create the storefront layout with a hero, featured products, a cart drawer placeholder, and a footer.",
      createdAt: "4:55 PM",
    },
  ],
  "fitness-landing": [
    {
      id: "seed-fitness-user",
      role: "user",
      content: "Build a high-conversion landing page for a fitness coaching studio.",
      createdAt: "8:12 AM",
    },
    {
      id: "seed-fitness-assistant",
      role: "assistant",
      content:
        "I'll write the landing page with a hero, program cards, a testimonial placeholder, and a strong signup CTA.",
      createdAt: "8:12 AM",
    },
  ],
};

// ---------------------------------------------------------------------------
// File trees, file maps, and accessors used by the project workspace.
// ---------------------------------------------------------------------------

/**
 * Builds a folder-first FileNode tree from a flat list of project files.
 * Sample paths are "folder/file.ext" (e.g. "app/page.tsx").
 */
function buildFileTree(files: ProjectFile[]): FileNode[] {
  const folders = new Map<string, FileNode>();
  const rootFiles: FileNode[] = [];

  for (const file of files) {
    const segments = file.path.split("/");
    if (segments.length === 1) {
      rootFiles.push({
        name: segments[0],
        path: file.path,
        type: "file",
        language: file.language,
      });
      continue;
    }

    const folderName = segments[0];
    let folder = folders.get(folderName);
    if (!folder) {
      folder = {
        name: folderName,
        path: folderName,
        type: "folder",
        children: [],
      };
      folders.set(folderName, folder);
    }
    folder.children?.push({
      name: segments[segments.length - 1],
      path: file.path,
      type: "file",
      language: file.language,
    });
  }

  const folderNodes = [...folders.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return [...folderNodes, ...rootFiles];
}

/** File tree for the workspace explorer. Generated projects also show public/. */
export function getProjectFileTree(id: string): FileNode[] {
  if (id === demoProjectId) {
    return [];
  }
  const tree = buildFileTree(getSampleFiles(id));
  return [
    ...tree,
    { name: "public", path: "public", type: "folder", children: [] },
  ];
}

/** Lookup of file path → file, used to resolve the selected explorer entry. */
export function getProjectFileMap(id: string): Record<string, ProjectFile> {
  return Object.fromEntries(
    getSampleFiles(id).map((file) => [file.path, file]),
  );
}

/** Conversation the workspace opens with. The demo project starts empty. */
export function getInitialChatMessages(id: string): ChatMessage[] {
  return chatSeeds[id] ?? [];
}

