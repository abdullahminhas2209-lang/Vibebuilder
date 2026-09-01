import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
        aria-hidden="true"
      >
        <path d="M13.7 2.1a.55.55 0 0 1 .95.48l-1.06 5.1h5.06a.55.55 0 0 1 .42.9l-8.7 10.4a.55.55 0 0 1-.96-.44l1.28-5.64H5.4a.55.55 0 0 1-.43-.9l8.73-9.9Z" />
      </svg>
    </span>
  );
}

interface LogoProps {
  /** Target for the wordmark link. Defaults to the landing page. */
  href?: string;
  className?: string;
  /** Hide the wordmark and render only the mark. */
  markOnly?: boolean;
  /** Optional click handler (e.g. to close a mobile drawer on navigation). */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function Logo({
  href = "/",
  className,
  markOnly = false,
  onClick,
}: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="VibeBuilder home"
      className={cn(
        "inline-flex items-center gap-2 rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <LogoMark />
      {!markOnly && (
        <span className="text-[15px] font-semibold tracking-tight">
          VibeBuilder
        </span>
      )}
    </Link>
  );
}
