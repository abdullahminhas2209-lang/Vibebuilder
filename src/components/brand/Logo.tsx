import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoMarkProps {
  className?: string;
  size?: number | string;
}

export function LogoMark({ className, size }: LogoMarkProps) {
  const customStyle =
    size !== undefined
      ? {
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }
      : undefined;

  return (
    <span
      aria-hidden="true"
      style={customStyle}
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center rounded-[3px] bg-amber shadow-sm overflow-hidden",
        className,
      )}
    >
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
      >
        <polygon
          points="10,7 14.95,7 21,14 14.95,21 10,21 13.3,14"
          fill="#14161f"
        />
      </svg>
    </span>
  );
}

export interface LogoProps {
  /** Target for the wordmark link. Defaults to the landing page. */
  href?: string;
  className?: string;
  /** Custom size for the mark icon (e.g. 24, 28, 32, "2rem") */
  size?: number | string;
  /** Hide the wordmark and render only the mark. */
  markOnly?: boolean;
  /** Optional click handler (e.g. to close a mobile drawer on navigation). */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function Logo({
  href = "/",
  className,
  size,
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
      <LogoMark size={size} />
      {!markOnly && <span>Klyro</span>}
    </Link>
  );
}

export default Logo;
