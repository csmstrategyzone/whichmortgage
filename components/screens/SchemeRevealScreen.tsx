"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Brand from "@/components/Brand";
import Ticker, { easeOutExpo } from "@/components/Ticker";
import { num } from "@/lib/calc";

export default function SchemeRevealScreen({
  htb,
  onContinue,
}: {
  htb: number;
  onContinue: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !scope.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".seq", {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.16,
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section className="grain relative flex min-h-dvh w-full flex-col overflow-hidden bg-navy">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 70% at 78% 60%, rgba(242,107,31,0.13), transparent)",
        }}
      />

      {/* top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
        <Brand tone="light" />
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-white/55">
            Government schemes · 1 of 3
          </span>
          <div className="h-[3px] w-[100px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 rounded-full bg-orange" />
          </div>
        </div>
      </header>

      {/* centre content */}
      <div
        ref={scope}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center"
      >
        <p className="seq text-[13px] font-normal text-white/60">
          You qualify for
        </p>
        <p
          className="seq mt-3 font-serif font-light text-white/55"
          style={{ fontSize: "26px", letterSpacing: "-0.02em" }}
        >
          Help to Buy Ireland
        </p>

        <div className="seq mt-4 flex items-baseline justify-center text-white">
          <span
            className="font-serif font-light text-white/50"
            style={{ fontSize: "clamp(30px, 7vw, 56px)" }}
          >
            €
          </span>
          <span
            className="font-serif font-light"
            style={{
              fontSize: "clamp(74px, 17vw, 140px)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            <Ticker
              value={htb}
              from={0}
              duration={1200}
              easing={easeOutExpo}
              format={(n) => num(n)}
            />
          </span>
        </div>

        <div className="seq mt-7 h-[0.5px] w-[60px] bg-orange" />

        <p
          className="seq mt-7 max-w-md font-serif italic font-light leading-snug text-white/70"
          style={{ fontSize: "18px" }}
        >
          A refund of Irish income tax paid over the last four years — added
          directly to your deposit.
        </p>

        <button
          onClick={onContinue}
          className="seq group mt-10 inline-flex items-center gap-2.5 rounded-[6px] bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
        >
          See what this unlocks
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>
      </div>
    </section>
  );
}
