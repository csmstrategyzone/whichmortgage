"use client";

import { useEffect, useRef, useState } from "react";

type Easing = (p: number) => number;

export const easeOutExpo: Easing = (p) =>
  p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
export const easeOutCubic: Easing = (p) => 1 - Math.pow(1 - p, 3);

interface Props {
  value: number;
  from?: number;
  duration?: number; // ms
  easing?: Easing;
  format?: (n: number) => string;
  className?: string;
}

/** Counts up to `value` on mount / when value changes. */
export default function Ticker({
  value,
  from,
  duration = 1200,
  easing = easeOutCubic,
  format = (n) => Math.round(n).toLocaleString("en-IE"),
  className,
}: Props) {
  const [display, setDisplay] = useState(from ?? value);
  const fromRef = useRef(from ?? value);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const start = fromRef.current;
    const to = value;
    if (reduce || start === to) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }
    startRef.current = null;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      setDisplay(start + (to - start) * easing(p));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, easing]);

  return <span className={className}>{format(display)}</span>;
}
