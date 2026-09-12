"use client";

import { useEffect, useState, memo } from "react";

interface TypewriterTextProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  emptyPauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

const DEFAULT_WORDS = [
  "product.",
  "website.",
  "web app.",
  "landing page.",
  "SaaS platform.",
  "storefront.",
];

export const TypewriterText = memo(function TypewriterText({
  words = DEFAULT_WORDS,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2000,
  emptyPauseDuration = 280,
  className = "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display",
  cursorClassName = "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.85)]",
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0] || "product.");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[wordIndex] || "";

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Pausing briefly at empty state before starting next word
        timer = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }, emptyPauseDuration);
      }
    } else {
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Full word typed out — hold before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, emptyPauseDuration]);

  return (
    <span className="inline-flex items-baseline whitespace-nowrap will-change-contents font-display">
      <span className={className}>{displayText}</span>
      <span
        aria-hidden="true"
        className={`inline-block w-[3px] sm:w-[4px] h-[0.82em] ml-1 sm:ml-1.5 rounded-full align-baseline animate-cursor-blink ${cursorClassName}`}
      />
    </span>
  );
});
