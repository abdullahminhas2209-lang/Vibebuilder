import { AI_MODEL_DISPLAY_NAME, CONTACT_EMAIL } from "@/lib/constants";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  reviewFlag?: string; // Internal note for founder review
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "export-contents",
    question: "What exactly do I get after I export?",
    answer:
      "When you export a project from Klyro, you receive a clean, organized Next.js project directory. It includes functional TypeScript components (React 19 / Next.js App Router), standard Tailwind CSS configuration, package.json with dependencies, Lucide icons, and layout files. On Starter, you can export individual component code; on Pro and Team, you can download the entire multi-file project source as a ZIP archive or connect it directly to your repository.",
  },
  {
    id: "code-ownership",
    question: "Do I own the generated code? Can I use it commercially?",
    answer:
      "Yes, absolutely. You own 100% of the code, layout structures, and assets generated through your prompts. There is zero vendor lock-in. You are free to use your exported projects for commercial client work, SaaS products, open-source repositories, or internal business operations with no royalties or attribution required.",
  },
  {
    id: "backend-and-database",
    question: "Does Klyro build a backend or database? What happens when I need one?",
    answer:
      "Klyro focuses on crafting front-end interfaces, page structures, responsive layouts, and interactive client-side states with realistic mock data. It does not provision live database servers, serverless backends, authentication databases, or payment gateways. When you need a backend, your exported Next.js code is structured to easily connect with your preferred providers like Supabase, Prisma, PostgreSQL, NextAuth, Clerk, or Stripe.",
  },
  {
    id: "generation-definition",
    question: "What counts as a generation?",
    answer:
      "A generation is defined as creating one complete web application or page from a new prompt. On the Pro and Team plans, follow-up conversational refinements and design tweaks made within an active workspace are conversational edits—these are unlimited and do not count toward your generation total.",
  },
  {
    id: "plan-differences",
    question: "What is the difference between Starter, Pro, and Team?",
    answer:
      "Starter is free forever and includes 5 generations per month with single-component export. Pro ($15/mo billed annually or $19/mo billed monthly) provides unlimited generations (subject to fair use), full multi-file project source exports (ZIP download), conversational editing & redirects, and priority model access for a single user. Team ($39/mo billed annually or $49/mo billed monthly) includes up to 5 workspace seats, shared team projects, and dedicated support.",
  },
  {
    id: "conversational-edits",
    question: "Can I edit or redirect the app after it's generated?",
    answer:
      "Yes. On Pro and Team plans, you can chat conversationally with the editor to make adjustments. You can request layout adjustments, color palette shifts, new sections, revised copy, or component additions. The running sandbox updates live alongside your conversation so you can inspect changes immediately.",
  },
  {
    id: "difference-from-others",
    question: "How is Klyro different from other AI app builders?",
    answer:
      "Klyro is built specifically for engineers and designers who value clean, readable code over brittle 'black box' visual builders. Instead of proprietary widgets or non-standard runtime frameworks, Klyro generates standard Next.js, TypeScript, and Tailwind CSS code that follows modern web conventions and can be maintained by any developer.",
  },
  {
    id: "ai-model-training",
    question: "Which AI model powers Klyro, and is my prompt data used for training?",
    answer:
      `Klyro is powered by Google's ${AI_MODEL_DISPLAY_NAME}. We communicate with Google Gemini via enterprise commercial API endpoints. Under standard commercial API data terms, customer prompts and generated outputs processed through paid API endpoints are not used to train Google's models. We do not sell or monetize your prompt data.`,
    reviewFlag:
      "FLAGGED FOR FOUNDER REVIEW: Confirm your exact Google Cloud Gemini API data governance agreement and ensure your privacy policy aligns with this wording.",
  },
  {
    id: "cancellation-refunds",
    question: "How do I cancel or get a refund?",
    answer:
      `You can cancel your paid subscription at any time directly through your workspace settings. Upon cancellation, your access remains active until the end of your current billing period. If you experience technical issues or are dissatisfied with your first billing cycle, contact us at ${CONTACT_EMAIL} within 14 days for assistance.`,
    reviewFlag:
      "FLAGGED FOR FOUNDER REVIEW: Confirm your intended refund policy (e.g. 14-day refund window vs no refunds once credits are utilized) before billing goes live.",
  },
];

/**
 * Returns Schema.org FAQPage JSON-LD object for SEO indexing
 */
export function getFaqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
