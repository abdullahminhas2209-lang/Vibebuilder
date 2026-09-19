/**
 * PLACEHOLDER "BUILT WITH KLYRO" GALLERY DATA
 * NOTE FOR FOUNDER: Replace these 6 items with real screenshots and user project prompts.
 * This gallery is gated behind SHOW_SOCIAL_PROOF (NEXT_PUBLIC_SHOW_SOCIAL_PROOF).
 */

export interface BuiltWithGalleryItem {
  id: string;
  title: string;
  prompt: string;
  screenshot: string; // Placeholder image URL
  category: string;
}

export const BUILT_WITH_GALLERY_DATA: BuiltWithGalleryItem[] = [
  {
    id: "gallery-1",
    title: "[Placeholder App: Modern FinTech Portal]",
    prompt: "Minimal dark-mode dashboard for crypto payments with ledger history",
    screenshot: "/placeholder-gallery-1.png",
    category: "FinTech",
  },
  {
    id: "gallery-2",
    title: "[Placeholder App: Specialty Coffee Roastery]",
    prompt: "Single-origin coffee roastery storefront with bean subscriptions",
    screenshot: "/placeholder-gallery-2.png",
    category: "E-Commerce",
  },
  {
    id: "gallery-3",
    title: "[Placeholder App: Team Retro Board]",
    prompt: "Collaborative sprint retrospective board with vote counter and stickies",
    screenshot: "/placeholder-gallery-3.png",
    category: "Productivity",
  },
  {
    id: "gallery-4",
    title: "[Placeholder App: Boutique Hotel Booking]",
    prompt: "Nordic cabin retreat landing page with room availability calendar",
    screenshot: "/placeholder-gallery-4.png",
    category: "Hospitality",
  },
  {
    id: "gallery-5",
    title: "[Placeholder App: Developer Docs Platform]",
    prompt: "API documentation portal with sidebar navigation and code copy blocks",
    screenshot: "/placeholder-gallery-5.png",
    category: "Developer Tools",
  },
  {
    id: "gallery-6",
    title: "[Placeholder App: AI Prompt Directory]",
    prompt: "Curated prompt directory with upvoting, category tags, and search modal",
    screenshot: "/placeholder-gallery-6.png",
    category: "Directory",
  },
];
