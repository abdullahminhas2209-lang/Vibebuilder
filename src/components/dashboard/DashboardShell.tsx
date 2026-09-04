"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar, SidebarContent } from "@/components/dashboard/Sidebar";

/**
 * Dashboard frame: fixed glassmorphic sidebar on desktop, slide-in drawer on mobile.
 * The page content is passed as children so every dashboard route can
 * share the same navigation shell.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#0B0F19] text-slate-100">
      <Sidebar />

      {/* Mobile top bar with navigation drawer */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-800/80 bg-[#0B0F19]/85 backdrop-blur-xl px-4 lg:hidden">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 gap-0 p-0 bg-[#0B0F19] border-r border-slate-800 text-slate-100">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent onNavigate={() => setNavOpen(false)} />
          </SheetContent>
        </Sheet>
        <Logo />
      </header>

      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
