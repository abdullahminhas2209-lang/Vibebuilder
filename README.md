# Klyro

**From prompt to product.**

Klyro turns natural language descriptions into interactive, clean Next.js and Tailwind web applications. Describe your idea in plain English — Klyro structures the pages, layouts, and components so you can preview, edit, and export your source code.

---

## Environment & Deployment Configuration

- **Site URL**: Configured via `NEXT_PUBLIC_SITE_URL`. Defaults in code to `https://klyro-gamma.vercel.app`.
- **Note**: To change the site URL later, update `NEXT_PUBLIC_SITE_URL` in Vercel → Project Settings → Environment Variables and redeploy.
- **AI Model**: Powered by Google Gemini 3.5 Flash (`gemini-3.5-flash`).

---

## What Klyro Generates (and What It Doesn't)

### What Klyro Generates
- Clean, editable React functional components with TypeScript and Next.js App Router conventions
- Responsive Tailwind CSS styling
- Client-side interactive states (tabs, modals, filters, forms)
- Realistic mock sample data
- Multi-file project source ready for ZIP export or Git commit

### What You Connect Yourself
- Production database instances (e.g. Supabase, PostgreSQL)
- Authentication providers (e.g. NextAuth, Clerk, Supabase Auth)
- Payment gateways (e.g. Stripe, Lemon Squeezy)
- Transactional email providers (e.g. Resend, SendGrid)

---

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Motion | 13 |
| Lucide React | latest |

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, How It Works, Showcase, Pricing, FAQ) |
| `/contact` | Team inquiry and contact form |
| `/terms` | Terms of Service and code ownership policy |
| `/privacy` | Privacy Policy and data protection compliance |
| `/signin` | Account login |
| `/signup` | Account registration (supports ?plan=pro waitlist state) |
| `/dashboard` | Project dashboard |
| `/project/[id]` | Real-time AI editing workspace |

---

## License

MIT
