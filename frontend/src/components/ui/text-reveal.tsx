"use client";

import { useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface TextRevealByWordProps {
  text: string;
  className?: string;
  targetRef?: RefObject<HTMLElement | null>;
  render?: (progress: MotionValue<number>) => ReactNode;
  onRevealChange?: (complete: boolean) => void;
}

export function TextRevealByWord({ text, className = '', targetRef, render, onRevealChange }: TextRevealByWordProps) {
  const ownRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef ?? ownRef,
    offset: ['start 88%', 'end 48%'],
    trackContentSize: true,
  });
  useMotionValueEvent(scrollYProgress, 'change', value => onRevealChange?.(reduced || value >= 0.99));
  const words = text.trim().split(/\s+/);
  return <span ref={ownRef} className={className}>
    {render ? render(scrollYProgress) : words.map((word, index) => (
      <TextRevealWord key={index} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]}>
        {word}{index < words.length - 1 ? ' ' : ''}
      </TextRevealWord>
    ))}
  </span>;
}

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  ghost?: boolean;
  className?: string;
}

export function TextRevealWord({ children, progress, range, ghost = true, className = '' }: WordProps) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, range, ghost ? [0, 1] : [0.3, 1]);
  if (!ghost) return <motion.span className={className} style={{ opacity: reduced ? 1 : opacity }}>{children}</motion.span>;
  return <span data-innovation-word className={`scroll-reveal-word ${className}`}>
    <span aria-hidden="true" className="scroll-reveal-ghost">{children}</span>
    <motion.span className="scroll-reveal-foreground" style={{ opacity: reduced ? 1 : opacity }}>{children}</motion.span>
  </span>;
}
