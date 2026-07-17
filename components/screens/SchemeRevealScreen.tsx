"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Check } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import Ticker, { easeOutExpo } from "@/components/Ticker";
import { num } from "@/lib/calc";

const CHECKS = [
  "You've paid Irish income tax the past 4 years",
  "You're buying a new-build",
  "You're a first-time buyer",
];

export default function SchemeRevealScreen({
  htb,
  onContinue,
}: {
  htb: number;
  onContinue: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const topPanel = useRef<HTMLDivElement>(null);
  const botPanel = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      setRevealed(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl.from(".seq", { opacity: 0, y: 18, duration: 0.6, stagger: 0.14 })
        // vault doors split apart
        .to(topPanel.current, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, "+=0.1")
        .to(botPanel.current, { yPercent: 100, duration: 0.6, ease: "power3.inOut" }, "<")
        .from(
          numberRef.current,
          { scale: 0.9, opacity: 0, duration: 0.6, ease: "back.out(1.7)" },
          "<0.1"
        )
        .add(() => setRevealed(true), "<0.2");
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-navy">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(242,107,31,0.14), transparent 60%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <LogoMark tone="light" />
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-white/55">
            Government schemes · 1 of 3
          </span>
          <div className="h-[3px] w-[100px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 rounded-full bg-white/70" />
          </div>
        </div>
      </header>

      <div
        ref={scope}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center"
      >
        <p className="seq text-[13px] text-white/60">You qualify for</p>
        <p className="seq mt-2 text-[20px] font-medium text-white/55">
          Help to Buy Ireland
        </p>

        {/* vault number */}
        <div className="relative mt-5 overflow-hidden py-2">
          <div ref={numberRef} className="flex items-baseline justify-center">
            <span
              className="h text-orange/50"
              style={{ fontSize: "clamp(30px, 7vw, 56px)" }}
            >
              €
            </span>
            <span
              className="h text-orange"
              style={{ fontSize: "clamp(74px, 17vw, 140px)", lineHeight: 1 }}
            >
              {revealed ? (
                <Ticker value={htb} from={0} duration={1200} easing={easeOutExpo} format={(n) => num(n)} />
              ) : (
                num(htb)
              )}
            </span>
          </div>
          {/* vault doors */}
          <div ref={topPanel} className="absolute inset-x-0 top-0 h-1/2 bg-navy" />
          <div ref={botPanel} className="absolute inset-x-0 bottom-0 h-1/2 bg-navy" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 bg-white/15" />
        </div>

        <p className="seq mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
          A refund of the Irish income tax you&apos;ve already paid — added
          directly to your deposit.
        </p>

        {/* checkmarks */}
        <ul className="mt-8 space-y-3 text-left">
          {CHECKS.map((c, idx) => (
            <li
              key={c}
              className="flex items-center gap-3 text-[15px] text-white/85"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "none" : "translateY(8px)",
                transition: `opacity 0.4s ease ${idx * 0.3 + 0.2}s, transform 0.4s ease ${idx * 0.3 + 0.2}s`,
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <Check className="h-3.5 w-3.5 text-orange" />
              </span>
              {c}
            </li>
          ))}
        </ul>

        <button
          onClick={onContinue}
          className="group mt-11 inline-flex items-center gap-2.5 rounded-full bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.5s ease 1.1s",
          }}
        >
          See what this unlocks
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>
      </div>
    </section>
  );
}
