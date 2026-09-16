"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsUpDown,
  FolderKanban,
  LayoutTemplate,
  LogOut,
  Settings,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Projects", href: "/dashboard", icon: FolderKanban, soon: false },
  { label: "Explore", href: "/#what-you-can-build", icon: LayoutTemplate, soon: false },
  { label: "Settings", href: "#", icon: Settings, soon: true },
] as const;

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const userName = profile?.fullName || "Guest User";
  const userEmail = profile?.email || "guest@klyro.app";
  const userInitials = profile?.initials || "GU";

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col text-cream bg-ink border-r border-slate-line font-sans">
      {/* Top Brand Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-slate-line px-4">
        <Logo onClick={onNavigate} />
      </div>

      {/* Nav items */}
      <nav aria-label="Dashboard" className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          if (item.soon) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-mono font-medium text-fog-dim"
              >
                <item.icon className="size-4 text-fog-dim" aria-hidden="true" />
                {item.label}
                <Badge
                  variant="secondary"
                  className="ml-auto bg-ink-raised text-fog-dim border-slate-line px-1.5 py-0 text-[10px] font-mono rounded-sm"
                >
                  Soon
                </Badge>
              </span>
            );
          }

          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname.startsWith("/dashboard"));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-mono font-medium transition-all",
                isActive
                  ? "bg-amber/15 text-amber border border-amber/30 shadow-xs font-semibold"
                  : "text-fog hover:bg-ink-raised hover:text-cream border border-transparent",
              )}
            >
              <item.icon className={cn("size-4", isActive ? "text-amber" : "text-fog")} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="border-t border-slate-line p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-2.5 px-2.5 py-2 rounded-sm text-cream hover:bg-ink-raised"
              aria-label="Open account menu"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-ink-raised border border-slate-line font-mono text-xs font-bold text-amber">
                {userInitials}
              </span>
              <span className="flex min-w-0 flex-col items-start text-left">
                <span className="truncate text-xs font-semibold text-cream max-w-[125px]">
                  {userName}
                </span>
                <span className="truncate font-mono text-[11px] text-fog max-w-[125px]">
                  {userEmail}
                </span>
              </span>
              <ChevronsUpDown
                className="ml-auto size-4 text-fog-dim"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 bg-ink-raised border-slate-line text-cream shadow-2xl rounded-md p-1.5 font-sans">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-xs font-serif font-semibold text-cream truncate">{userName}</p>
              <p className="text-[11px] font-mono text-fog truncate">
                {userEmail}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-line" />
            <DropdownMenuItem asChild className="rounded-sm text-xs font-mono cursor-pointer focus:bg-ink focus:text-cream">
              <Link href="/dashboard">
                <FolderKanban className="size-3.5 mr-2 text-amber" />
                My Projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-line" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-sm text-xs font-mono text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
            >
              <LogOut className="size-3.5 mr-2" aria-hidden="true" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
      <SidebarContent />
    </aside>
  );
}
