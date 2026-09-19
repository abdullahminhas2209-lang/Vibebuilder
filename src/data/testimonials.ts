/**
 * PLACEHOLDER TESTIMONIAL DATA
 * NOTE FOR FOUNDER: Replace these placeholder items with genuine verified user quotes.
 * This section is gated behind the SHOW_SOCIAL_PROOF flag (NEXT_PUBLIC_SHOW_SOCIAL_PROOF)
 * and will not render in production until real quotes are provided and the flag is set to true.
 */

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string; // URL or initials placeholder
  company?: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testimonial-1",
    quote:
      "PLACEHOLDER: 'Klyro helped our design agency scaffold client prototypes in hours instead of days. The generated Next.js code is clean and easy to extend.'",
    name: "[Placeholder Name 1]",
    role: "Agency Founder & Engineer",
    avatar: "/placeholder-avatar-1.png",
    company: "[Design Studio]",
  },
  {
    id: "testimonial-2",
    quote:
      "PLACEHOLDER: 'Being able to describe a full web interface and get editable Tailwind components saved me weeks on my SaaS validation.'",
    name: "[Placeholder Name 2]",
    role: "Indie Hacker & Creator",
    avatar: "/placeholder-avatar-2.png",
    company: "[Micro-SaaS]",
  },
  {
    id: "testimonial-3",
    quote:
      "PLACEHOLDER: 'The multi-device sandbox preview and one-click code export make it the fastest way to turn product ideas into working mockups.'",
    name: "[Placeholder Name 3]",
    role: "Head of Product",
    avatar: "/placeholder-avatar-3.png",
    company: "[Product Lab]",
  },
];
