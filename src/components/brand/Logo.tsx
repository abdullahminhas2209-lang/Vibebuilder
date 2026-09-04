import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-4.5 drop-shadow"
        aria-hidden="true"
      >
        {/* Geometric stylized K with forward movement chevron */}
        <path
          d="M6 4.5V19.5"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
        <path
          d="M17.5 5L9.5 12L18 19"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="17.5" cy="5" r="1" fill="currentColor" />
        <circle cx="18" cy="19" r="1" fill="currentColor" />
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
      aria-label="Klyro home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 focus-visible:outline-none transition-transform hover:scale-[1.02]",
        className,
      )}
    >
      <LogoMark />
      {!markOnly && (
        <span className="flex items-center gap-0.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Klyro
          <span className="size-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 ml-0.5"></span>
        </span>
      )}
    </Link>
  );
}
