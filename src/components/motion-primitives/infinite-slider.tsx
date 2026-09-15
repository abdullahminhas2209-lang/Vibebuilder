'use client';

import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion, useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import useMeasure from 'react-use-measure';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 24,
  speed = 70,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const currentSpeed =
    isHovering && speedOnHover !== undefined ? speedOnHover : speed;
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, disable continuous animation
    if (shouldReduceMotion) {
      translation.set(0);
      return;
    }

    const size = direction === 'horizontal' ? width : height;
    // Wait until element has been measured
    if (size === 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const distanceToTravel = Math.abs(to - from);

    // If speed is 0 or less, pause animation at current position
    if (currentSpeed <= 0) {
      return;
    }

    const duration = distanceToTravel / currentSpeed;
    let controls: { stop: () => void } | undefined;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const transitionDuration = remainingDistance / currentSpeed;

      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    shouldReduceMotion,
  ]);

  const handleStartHover = () => {
    if (speedOnHover !== undefined) {
      setIsTransitioning(true);
      setIsHovering(true);
    }
  };

  const handleEndHover = () => {
    if (speedOnHover !== undefined) {
      setIsTransitioning(true);
      setIsHovering(false);
    }
  };

  const hoverProps =
    speedOnHover !== undefined
      ? {
          onHoverStart: handleStartHover,
          onHoverEnd: handleEndHover,
          onMouseEnter: handleStartHover,
          onMouseLeave: handleEndHover,
        }
      : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className='flex w-max'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
