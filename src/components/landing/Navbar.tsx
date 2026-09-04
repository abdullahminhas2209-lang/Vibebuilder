"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [scrolled, setScrolled] = useState(false);

  const { profile, signOut } = useAuth();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleDashboardClick(e: React.MouseEvent) {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const heroElement = document.getElementById("hero-builder");
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("hero-prompt-input");
        if (input) input.focus();
      }
    }
  }

  function openAuth(mode: "signin" | "signup") {
    setAuthTab(mode);
    setAuthOpen(true);
    setIsOpen(false);
  }

  return (
    <>
      <div className="sticky top-0 z-50 w-full px-4 pt-3 sm:px-6">
        <header
          className={cn(
            "mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 rounded-2xl transition-all duration-300",
            scrolled
              ? "bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              : "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-sm"
          )}
        >
          {/* LEFT: Logo */}
          <Logo />

          {/* CENTER: Navigation (Dashboard, How It Works, Templates) */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full bg-slate-100/70 dark:bg-slate-800/60 p-1 border border-slate-200/50 dark:border-slate-700/50 md:flex"
          >
            <Link
              href="/#hero-builder"
              onClick={handleDashboardClick}
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-white dark:hover:bg-slate-700 shadow-sm"
            >
              Dashboard
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-white/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
            >
              How It Works
            </Link>
            <Link
              href="#templates"
              className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-white/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
            >
              Templates
            </Link>
          </nav>

          {/* RIGHT SIDE: Auth & Primary CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {profile ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-xl border-slate-200 bg-white/80 text-xs font-medium hover:bg-slate-100 dark:border-slate-700"
                >
                  <Link href="/dashboard" className="gap-1.5">
                    <LayoutDashboard className="size-3.5 text-indigo-600" />
                    <span>My Projects</span>
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 px-2 rounded-xl">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                        {profile.initials}
                      </span>
                      <span className="max-w-[120px] truncate text-xs font-semibold">
                        {profile.firstName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                    <DropdownMenuLabel className="px-2 py-1.5">
                      <p className="text-sm font-semibold">{profile.fullName}</p>
                      <p className="text-xs font-normal text-muted-foreground truncate">{profile.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/dashboard">
                        <LayoutDashboard className="size-4 mr-2 text-indigo-500" />
                        Projects Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuth("signin")}
                  className="rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white"
                >
                  Sign In / Register
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuth("signup")}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/30 gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="size-3.5" />
                  <span>Get Started Free</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden rounded-xl border-slate-200 bg-white/70"
                aria-label="Open navigation menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 rounded-l-3xl">
              <SheetHeader className="pb-4 border-b border-border">
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1.5 mt-6">
                <Link
                  href="/#hero-builder"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleDashboardClick(e);
                  }}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  How It Works
                </Link>
                <Link
                  href="#templates"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Templates
                </Link>
              </nav>

              <div className="mt-auto flex flex-col gap-2.5 pt-6 border-t border-border">
                {profile ? (
                  <>
                    <div className="flex items-center gap-3 px-1 py-2">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                        {profile.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{profile.fullName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{profile.email}</p>
                      </div>
                    </div>
                    <Button asChild className="rounded-xl">
                      <Link href="/dashboard">Go to Projects</Link>
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="rounded-xl text-xs font-semibold"
                      onClick={() => openAuth("signin")}
                    >
                      Sign In / Register
                    </Button>
                    <Button
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-semibold text-white shadow-md shadow-indigo-500/20"
                      onClick={() => openAuth("signup")}
                    >
                      Get Started Free
                      <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </header>
      </div>

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />
    </>
  );
}
