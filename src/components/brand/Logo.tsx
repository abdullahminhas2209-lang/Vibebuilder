import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-[3px] bg-amber text-[#201404] shadow-sm",
        className,
      )}
    >
      <span
        className="absolute inset-[7px_7px_7px_10px] bg-ink"
        style={{
          clipPath: "polygon(0 0, 45% 0, 100% 50%, 45% 100%, 0 100%, 30% 50%)",
        }}
      />
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
        "group inline-flex items-center gap-2.5 font-serif text-xl font-semibold tracking-[-0.01em] text-cream transition-opacity hover:opacity-90",
        className,
      )}
    >
      <LogoMark />
      {!markOnly && <span>Klyro</span>}
    </Link>
  );
}
