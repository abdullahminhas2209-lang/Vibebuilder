'use client';
import { cn } from '@/lib/utils';
import { motion, Transition } from 'motion/react';

export type BorderTrailProps = {
  className?: string;
  size?: number;
  borderRadius?: number | string;
  transition?: Transition;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function BorderTrail({
  className,
  size = 60,
  borderRadius,
  transition,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const defaultTransition: Transition = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear',
  };

  const cornerRadius =
    borderRadius !== undefined
      ? typeof borderRadius === 'number'
        ? `${borderRadius}px`
        : borderRadius
      : `${size}px`;

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent"
      style={{
        WebkitMaskImage:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        maskImage:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        maskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'intersect',
      }}
    >
      <motion.div
        className={cn('absolute aspect-square bg-zinc-500', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${cornerRadius})`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={transition || defaultTransition}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
