import Link from "next/link";
import {
  BarChart3,
  Copy,
  Dumbbell,
  ExternalLink,
  MoreVertical,
  Archive,
  ShoppingCart,
  Sparkles,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> =
  {
    draft: { label: "Draft", className: "bg-secondary text-secondary-foreground" },
    active: { label: "Active", className: "bg-primary/10 text-primary" },
    updated: { label: "Updated", className: "bg-card text-foreground ring-1 ring-border" },
  };

const thumbnailConfig: Record<string, { gradient: string; icon: typeof Sparkles }> =
  {
    "restaurant-booking": { gradient: "from-amber-500 to-orange-600", icon: UtensilsCrossed },
    "saas-analytics": { gradient: "from-sky-500 to-indigo-600", icon: BarChart3 },
    "personal-portfolio": { gradient: "from-violet-500 to-purple-600", icon: UserRound },
    "ecommerce-store": { gradient: "from-emerald-500 to-teal-600", icon: ShoppingCart },
    "fitness-landing": { gradient: "from-rose-500 to-red-600", icon: Dumbbell },
  };

const fallbackThumbnail = { gradient: "from-slate-500 to-slate-700", icon: Sparkles };

export function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status];
  const thumbnail = thumbnailConfig[project.id] ?? fallbackThumbnail;
  const ThumbnailIcon = thumbnail.icon;

  return (
    <Card className="group relative gap-0 overflow-hidden rounded-xl py-0 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
      {/* Card-level link overlay */}
      <Link
        href={`/project/${project.id}`}
        className="absolute inset-0 z-0 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`Open project: ${project.name}`}
      />

      <div
        className={cn(
          "relative flex h-28 items-center justify-center bg-gradient-to-br",
          thumbnail.gradient,
        )}
      >
        <ThumbnailIcon
          className="size-9 text-white/90 transition-transform duration-300 ease-out group-hover:scale-110"
          aria-hidden="true"
        />
        <Badge
          className={cn(
            "absolute top-3 left-3 border-none shadow-sm",
            status.className,
          )}
        >
          {status.label}
        </Badge>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{project.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-10 -mt-1.5 -mr-1.5 size-7 text-muted-foreground"
                aria-label={`Project options for ${project.name}`}
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/project/${project.id}`}>
                  <ExternalLink aria-hidden="true" />
                  Open project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Copy aria-hidden="true" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Archive aria-hidden="true" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="truncate">{project.type}</span>
          <span className="shrink-0">Updated {project.lastUpdated}</span>
        </div>
      </div>
    </Card>
  );
}
