"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Extra transition delay in ms, used to stagger siblings. */
  delay?: number;
  className?: string;
}

/**
 * Fades content in with a slight upward motion the first time it scrolls
 * into view. Content that is already on screen at hydration (or when
 * JavaScript is disabled) is shown immediately, so nothing is ever lost.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // Already on screen: show immediately without a transition.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setVisible(true);
      return;
    }

    setPending(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={
        visible
          ? `reveal-visible${className ? ` ${className}` : ""}`
          : pending
            ? `reveal-pending${className ? ` ${className}` : ""}`
            : className
      }
    >
      {children}
    </div>
  );
}
