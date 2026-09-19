"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  function handleNavScroll(e: React.MouseEvent, id: string) {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <footer className="border-t border-slate-line bg-ink text-cream py-12">
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
          <Logo />
          <div className="flex items-center gap-6 text-[13.5px] text-fog">
            <Link
              href="/#how"
              onClick={(e) => handleNavScroll(e, "how")}
              className="hover:text-cream transition-colors"
            >
              Product
            </Link>
            <Link
              href="/#what-you-can-build"
              onClick={(e) => handleNavScroll(e, "what-you-can-build")}
              className="hover:text-cream transition-colors"
            >
              Examples
            </Link>
            <Link
              href="/#pricing"
              onClick={(e) => handleNavScroll(e, "pricing")}
              className="hover:text-cream transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/signin"
              className="hover:text-cream transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="font-mono text-[11.5px] text-fog-dim mt-8 pt-6 border-t border-slate-line/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>© 2026 Klyro. Prompt to app, in one sitting.</span>
          <div className="flex items-center gap-4 text-fog">
            <Link
              href="/privacy"
              className="hover:text-cream transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
