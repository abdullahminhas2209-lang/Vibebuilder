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
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, soon: false },
  { label: "Projects", href: "/dashboard#projects", icon: FolderKanban, soon: false },
  { label: "Templates", href: "/dashboard", icon: Sparkles, soon: false },
  { label: "Settings", href: "#", icon: Settings, soon: true },
] as const;

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const userName = profile?.fullName || "Guest User";
  const userEmail = profile?.email || "guest@vibebuilder.app";
  const userInitials = profile?.initials || "GU";

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <Logo onClick={onNavigate} />
      </div>

      <nav aria-label="Dashboard" className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          if (item.soon) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground/60"
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
                <Badge
                  variant="secondary"
                  className="ml-auto px-1.5 py-0 text-[10px] font-medium"
                >
                  Soon
                </Badge>
              </span>
            );
          }

          const isProjectsAnchor = item.href !== "/dashboard";
          const isActive = !isProjectsAnchor && pathname === "/dashboard";

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:text-foreground",
              )}
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-2.5 px-2 py-2"
              aria-label="Open account menu"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {userInitials}
              </span>
              <span className="flex min-w-0 flex-col items-start">
                <span className="truncate text-sm font-medium text-foreground max-w-[130px]">
                  {userName}
                </span>
                <span className="truncate text-xs text-muted-foreground max-w-[130px]">
                  {userEmail}
                </span>
              </span>
              <ChevronsUpDown
                className="ml-auto size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs font-normal text-muted-foreground truncate">
                {userEmail}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="size-4 mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-4 mr-2" aria-hidden="true" />
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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-card lg:block">
      <SidebarContent />
    </aside>
  );
}
