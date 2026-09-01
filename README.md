# VibeBuilder

**Build websites by describing what you want.**

VibeBuilder is a modern AI-powered vibe-coding platform. Describe your idea in plain language — VibeBuilder turns it into a working interface you can preview, edit, and refine.

---

## Phase 1 — Frontend UI Shell

This repository contains the complete **Phase 1 frontend shell** of VibeBuilder. The UI is fully built and ready to connect to a real AI coding engine in Phase 2.

### What's included

- **Landing Page** — Hero, Features, How It Works, Final CTA, Footer
- **Dashboard** — Sidebar navigation, project cards, project grid
- **Project Workspace** — AI Chat panel, Live Preview, Code viewer, File Explorer
- **Mock interactions** — Simulated AI chat responses (no real API calls)
- **Responsive design** — Desktop, tablet, and mobile layouts

### What's NOT included (Phase 2)

- AI/LLM integration
- Backend or database
- Authentication
- Real code generation or execution
- Deployment pipeline

---

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| shadcn/ui | latest |
| Lucide React | latest |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Project dashboard |
| `/project/[id]` | Project workspace |
| `/project/demo` | Demo workspace (New Project) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Dashboard
│   └── project/[id]/page.tsx # Workspace
├── components/
│   ├── landing/              # Landing page components
│   ├── dashboard/            # Dashboard components
│   ├── workspace/            # Workspace components
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── mock-data.ts          # Centralized mock data
    ├── mock-chat.ts          # Mock chat logic
    ├── types.ts              # TypeScript types
    └── utils.ts              # Utilities
```

---

## CI/CD

GitHub Actions runs on every push and pull request:

- ✅ ESLint
- ✅ TypeScript type check
- ✅ Next.js production build

---

## License

MIT
