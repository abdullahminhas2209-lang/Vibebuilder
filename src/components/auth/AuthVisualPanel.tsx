"use client";

import React, { useRef, useEffect } from "react";

interface AuthVisualPanelProps {
  className?: string;
}

export function AuthVisualPanel({ className = "" }: AuthVisualPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video starts playing even if browser autoplay policies require programmatic invocation
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy prevented playback, video will remain muted
      });
    }
  }, []);

  return (
    <div
      className={`relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-line bg-[#10121a] shadow-inner flex items-center justify-center ${className}`}
      aria-label="Klyro logo animation visual"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover object-center"
      >
        <source src="/videos/klyro-logo-animation.webm" type="video/webm" />
        <source src="/videos/klyro-logo-animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default AuthVisualPanel;
