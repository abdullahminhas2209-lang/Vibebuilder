"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsUpDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
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
  { label: "Templates", href: "/#templates", icon: Sparkles, soon: false },
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
    <div className="flex h-full flex-col text-slate-100 bg-[#0B0F19]/80 backdrop-blur-xl border-r border-slate-800/80">
      {/* Top Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-800/80 px-4">
        <Logo onClick={onNavigate} />
      </div>

      {/* Nav items */}
      <nav aria-label="Dashboard" className="flex-1 space-y-1.5 p-3">
        {navigation.map((item) => {
          if (item.soon) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500"
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
                <Badge
                  variant="secondary"
                  className="ml-auto bg-slate-800/80 text-slate-400 border-slate-700/50 px-1.5 py-0 text-[10px] font-medium"
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
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-xs"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
              )}
            >
              <item.icon className={cn("size-4", isActive ? "text-indigo-400" : "text-slate-400")} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="border-t border-slate-800/80 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-2.5 px-2.5 py-2 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-white"
              aria-label="Open account menu"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                {userInitials}
              </span>
              <span className="flex min-w-0 flex-col items-start text-left">
                <span className="truncate text-xs font-semibold text-white max-w-[125px]">
                  {userName}
                </span>
                <span className="truncate text-[11px] text-slate-400 max-w-[125px]">
                  {userEmail}
                </span>
              </span>
              <ChevronsUpDown
                className="ml-auto size-4 text-slate-400"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 bg-[#0F172A] border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-1.5 ring-1 ring-white/10">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] font-normal text-slate-400 truncate">
                {userEmail}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem asChild className="rounded-lg text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
              <Link href="/dashboard">
                <FolderKanban className="size-3.5 mr-2 text-indigo-400" />
                My Projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-lg text-xs text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
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
