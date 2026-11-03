"use client";

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
  active?: boolean;
  reducedMotion?: boolean;
  render?: (visibleCharacters: number) => ReactNode;
  onComplete?: () => void;
}

export function Typewriter({ text, speed = 100, cursor = '|', loop = false, deleteSpeed = 50, delay = 1500, className, active = true, reducedMotion = false, render, onComplete }: TypewriterProps) {
  const [state, setState] = useState({ index: 0, count: 0, deleting: false });
  const texts = Array.isArray(text) ? text : [text];
  const currentText = texts[state.index % Math.max(texts.length, 1)] ?? '';
  const characters = Array.from(currentText);
  const complete = reducedMotion || state.count >= characters.length;

  useEffect(() => {
    if (complete && active) onComplete?.();
  }, [complete, active, onComplete]);

  useEffect(() => {
    if (!active || reducedMotion || !currentText || (complete && !loop)) return;
    const timeout = setTimeout(() => {
      setState(previous => {
        if (previous.deleting) return previous.count > 0
          ? { ...previous, count: previous.count - 1 }
          : { index: (previous.index + 1) % texts.length, count: 0, deleting: false };
        if (previous.count >= characters.length) return { ...previous, deleting: true };
        return { ...previous, count: previous.count + 1 };
      });
    }, state.deleting ? Math.max(0, deleteSpeed) : complete ? Math.max(0, delay) : Math.max(0, speed));
    return () => clearTimeout(timeout);
  }, [active, reducedMotion, currentText, complete, loop, speed, deleteSpeed, delay, state, texts.length, characters.length]);

  const visible = reducedMotion ? characters.length : state.count;
  return <span className={className} data-typewriter-complete={complete}>
    {render ? render(visible) : characters.slice(0, visible).join('')}
    {cursor && !reducedMotion && (!complete || loop) && <span aria-hidden="true" className="animate-pulse">{cursor}</span>}
  </span>;
}
