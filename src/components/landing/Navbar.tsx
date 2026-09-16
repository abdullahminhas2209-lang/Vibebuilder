"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";

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
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

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

  function handleNavScroll(e: React.MouseEvent, id: string) {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function handleStartBuilding(e?: React.MouseEvent) {
    if (e && window.location.pathname === "/") {
      e.preventDefault();
      const hero = document.getElementById("hero-builder");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
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
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-slate-line transition-colors duration-200",
          scrolled ? "bg-ink/95 backdrop-blur-md" : "bg-ink/90 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1180px] items-center justify-between px-5 sm:px-8">
          {/* LEFT: Brand Logo */}
          <Logo />

          {/* CENTER: Navigation links with animated background pill hover */}
          <nav aria-label="Primary" className="hidden items-center gap-1 text-[14.5px] text-fog md:flex">
            <AnimatedBackground
              className="rounded-sm bg-white/[0.08]"
              transition={{
                type: "spring",
                bounce: 0.15,
                duration: 0.3,
              }}
              enableHover
            >
              <Link
                data-id="product"
                href="#how"
                onClick={(e) => handleNavScroll(e, "how")}
                className="px-3.5 py-1.5 text-fog hover:text-cream transition-colors data-[checked=true]:text-cream"
              >
                Product
              </Link>
              <Link
                data-id="how-it-works"
                href="#how"
                onClick={(e) => handleNavScroll(e, "how")}
                className="px-3.5 py-1.5 text-fog hover:text-cream transition-colors data-[checked=true]:text-cream"
              >
                How it works
              </Link>
              <Link
                data-id="examples"
                href="#what-you-can-build"
                onClick={(e) => handleNavScroll(e, "what-you-can-build")}
                className="px-3.5 py-1.5 text-fog hover:text-cream transition-colors data-[checked=true]:text-cream"
              >
                Examples
              </Link>
              <Link
                data-id="pricing"
                href="#pricing"
                onClick={(e) => handleNavScroll(e, "pricing")}
                className="px-3.5 py-1.5 text-fog hover:text-cream transition-colors data-[checked=true]:text-cream"
              >
                Pricing
              </Link>
            </AnimatedBackground>
          </nav>

          {/* RIGHT SIDE: Auth & Primary Action Button */}
          <div className="hidden items-center gap-[22px] text-[14.5px] md:flex">
            {mounted && profile ? (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  asChild
                  className="rounded-sm bg-amber text-[#201404] hover:bg-amber-deep font-sans font-medium text-[14px] px-4 py-2 border-0 shadow-none"
                >
                  <Link href="/dashboard" className="gap-1.5 flex items-center">
                    <LayoutDashboard className="size-3.5" />
                    <span>My Projects</span>
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-sm border border-slate-line bg-ink-raised px-2.5 py-1.5 text-xs text-cream hover:border-fog-dim transition-colors">
                      <span className="flex size-6 items-center justify-center rounded-sm bg-amber text-xs font-bold text-[#201404]">
                        {profile.initials}
                      </span>
                      <span className="max-w-[110px] truncate font-medium">
                        {profile.firstName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-sm border border-slate-line bg-ink-raised p-1.5 text-cream">
                    <DropdownMenuLabel className="px-2 py-1.5">
                      <p className="text-sm font-semibold">{profile.fullName}</p>
                      <p className="text-xs text-fog truncate">{profile.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-line" />
                    <DropdownMenuItem asChild className="rounded-sm cursor-pointer hover:bg-slate-line">
                      <Link href="/dashboard">
                        <LayoutDashboard className="size-4 mr-2 text-amber" />
                        Projects Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-line" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="rounded-sm text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                    >
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuth("signin")}
                  className="text-fog hover:text-cream transition-colors cursor-pointer"
                >
                  Sign in
                </button>
                <Link
                  href="/#hero-builder"
                  onClick={handleStartBuilding}
                  className="inline-flex items-center gap-2 font-sans font-medium text-[14.5px] px-5 py-2.5 rounded-sm bg-amber text-[#201404] hover:bg-amber-deep transition-colors cursor-pointer"
                >
                  Start building
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="md:hidden p-2 text-cream hover:text-amber transition-colors"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6 rounded-none border-l border-slate-line bg-ink text-cream">
              <SheetHeader className="pb-4 border-b border-slate-line">
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-3 mt-6 text-sm text-fog">
                <Link
                  href="#how"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavScroll(e, "how");
                  }}
                  className="py-2 hover:text-cream transition-colors"
                >
                  Product
                </Link>
                <Link
                  href="#how"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavScroll(e, "how");
                  }}
                  className="py-2 hover:text-cream transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="#what-you-can-build"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavScroll(e, "what-you-can-build");
                  }}
                  className="py-2 hover:text-cream transition-colors"
                >
                  Examples
                </Link>
                <Link
                  href="#pricing"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavScroll(e, "pricing");
                  }}
                  className="py-2 hover:text-cream transition-colors"
                >
                  Pricing
                </Link>
              </nav>

              <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-slate-line">
                {mounted && profile ? (
                  <>
                    <div className="flex items-center gap-2.5 py-1">
                      <span className="flex size-7 items-center justify-center rounded-sm bg-amber text-xs font-bold text-[#201404]">
                        {profile.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{profile.fullName}</p>
                        <p className="text-[11px] text-fog truncate">{profile.email}</p>
                      </div>
                    </div>
                    <Button asChild className="rounded-sm bg-amber text-[#201404] hover:bg-amber-deep">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        Go to Projects
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-sm border-slate-line text-cream hover:border-fog-dim bg-transparent"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="text-left text-sm text-fog hover:text-cream py-1.5"
                      onClick={() => openAuth("signin")}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center font-medium text-sm px-4 py-2.5 rounded-sm bg-amber text-[#201404] hover:bg-amber-deep transition-colors text-center mt-2"
                      onClick={() => {
                        setIsOpen(false);
                        handleStartBuilding();
                      }}
                    >
                      Start building
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />
    </>
  );
}
