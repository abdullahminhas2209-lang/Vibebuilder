export interface ExampleItem {
  id: string;
  tabLabel: string;
  badge: string;
  prompt: string;
  headline: string;
  description: string;
  bullets: string[];
  mockup: {
    browserUrl: string;
    appName: string;
    type: "analytics" | "restaurant" | "store" | "blog" | "ops" | "fitness";
    theme: {
      accent: string;
      accentBg: string;
      badgeText?: string;
    };
  };
}

export const EXAMPLES_DATA: ExampleItem[] = [
  {
    id: "saas-analytics",
    tabLabel: "SaaS Analytics",
    badge: "Analytics Dashboard",
    prompt: "SaaS analytics dashboard with revenue charts and order metrics",
    headline: "Turn raw numbers into a decision",
    description:
      "Klyro structured the revenue chart, order table, and conversion cards from one prompt describing the metrics that mattered.",
    bullets: [
      "Interactive dashboard interface rendered with mock sample data",
      "Sortable order table with reactive client-side status filtering",
      "Clean Next.js layout structure; connect your own API or database",
    ],
    mockup: {
      browserUrl: "instacore.app/dashboard",
      appName: "InstaCore",
      type: "analytics",
      theme: {
        accent: "#f2a93b",
        accentBg: "rgba(242, 169, 59, 0.12)",
      },
    },
  },
  {
    id: "restaurant-booking",
    tabLabel: "Restaurant & Booking",
    badge: "Hospitality & Dining",
    prompt: "Restaurant site with seasonal menu and table reservation flow",
    headline: "A menu, a story, a way to book",
    description:
      "One sentence generated a warm homepage, an organized menu with photography placeholders, and a responsive table reservation flow.",
    bullets: [
      "Photo-first layout with typography crafted for dining and seasonal menus",
      "Front-end reservation form with party size and date controls; connect your booking API",
      "Responsive layout adjusted automatically for mobile and desktop screens",
    ],
    mockup: {
      browserUrl: "dineo.restaurant",
      appName: "Dineo",
      type: "restaurant",
      theme: {
        accent: "#d4a373",
        accentBg: "rgba(212, 163, 115, 0.15)",
      },
    },
  },
  {
    id: "ecommerce-store",
    tabLabel: "E-Commerce",
    badge: "Modern Storefront",
    prompt: "High-converting e-commerce storefront for minimalist homeware",
    headline: "Curated goods, seamless browsing",
    description:
      "A complete catalog experience designed with minimal aesthetic spacing, product filters, and cart interactions.",
    bullets: [
      "Product catalog grid with interactive category filters and variant selections",
      "Slide-over cart drawer with client-side state handling; connect Stripe or Shopify",
      "Product detail cards with responsive image containers and price badges",
    ],
    mockup: {
      browserUrl: "aura-homeware.com",
      appName: "Aura Home",
      type: "store",
      theme: {
        accent: "#e07a5f",
        accentBg: "rgba(224, 122, 95, 0.15)",
      },
    },
  },
  {
    id: "editorial-blog",
    tabLabel: "Blog & Newsletter",
    badge: "Editorial Publication",
    prompt: "Editorial publication and engineering newsletter with dark mode",
    headline: "Words that take center stage",
    description:
      "A focused reading platform with clean typographic hierarchy, newsletter opt-in forms, and post indexing.",
    bullets: [
      "Distraction-free editorial typography tuned for readability across devices",
      "Front-end newsletter capture component with client-side validation; connect Mailchimp or Resend",
      "Topic categorization and estimated reading time indicators",
    ],
    mockup: {
      browserUrl: "monolith.pub",
      appName: "The Monolith",
      type: "blog",
      theme: {
        accent: "#81b29a",
        accentBg: "rgba(129, 178, 154, 0.15)",
      },
    },
  },
  {
    id: "internal-ops",
    tabLabel: "Internal Admin",
    badge: "Operations Hub",
    prompt: "Internal operations hub with member management and status boards",
    headline: "Keep your internal workflows in sync",
    description:
      "A clean back-office application with searchable user directories, permission flags, and operational status queues.",
    bullets: [
      "Board and list views with interactive column filters and status tags",
      "Searchable team roster with role badges and activity timestamps",
      "Modular component structure ready to connect with Prisma or Supabase",
    ],
    mockup: {
      browserUrl: "taskpulse.internal/ops",
      appName: "TaskPulse Ops",
      type: "ops",
      theme: {
        accent: "#3d5a80",
        accentBg: "rgba(61, 90, 128, 0.2)",
      },
    },
  },
  {
    id: "mobile-fitness",
    tabLabel: "Fitness Studio",
    badge: "Mobile-First Studio",
    prompt: "Mobile-first fitness studio landing page with class schedules and coach bios",
    headline: "Energy and schedule, right on the phone",
    description:
      "Designed specifically for mobile conversion with scheduled class blocks, instructor spotlights, and pass booking previews.",
    bullets: [
      "Interactive day-by-day class timetable with intensity and room filters",
      "Instructor spotlight cards with discipline tags and bio dialog states",
      "Membership comparison cards; connect your own payment processor",
    ],
    mockup: {
      browserUrl: "corecraft.fit/schedule",
      appName: "CoreCraft",
      type: "fitness",
      theme: {
        accent: "#f4a261",
        accentBg: "rgba(244, 162, 97, 0.15)",
      },
    },
  },
];
