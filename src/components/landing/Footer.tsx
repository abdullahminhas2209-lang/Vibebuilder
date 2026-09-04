import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "AI Builder", href: "/#hero-builder" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Templates", href: "#templates" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Next.js 15", href: "#" },
      { label: "Tailwind CSS", href: "#" },
      { label: "Supabase", href: "#" },
      { label: "Export ZIP", href: "/dashboard" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/auth" },
      { label: "Register Account", href: "/auth" },
      { label: "My Projects", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0F19] text-slate-100 py-12 lg:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-xs text-slate-400 leading-relaxed">
              Klyro turns natural language descriptions into interactive, production-ready web applications. From prompt to product in seconds.
            </p>
            <p className="mt-4 text-[11px] text-slate-500 font-mono">
              Powered by Google Gemini &amp; Supabase
            </p>
          </div>

          {/* Nav Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Klyro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-400">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
