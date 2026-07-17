"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import GeorgianDoor from "@/components/GeorgianDoor";

export default function HeroScreen({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".line-inner", { yPercent: 110, duration: 1, stagger: 0.15 })
        .from(
          ".accent",
          { opacity: 0, scale: 0.92, duration: 0.8, ease: "power2.out" },
          "+=0.1"
        )
        .from(
          ".fade-up",
          { opacity: 0, y: 18, duration: 0.7, stagger: 0.12 },
          "+=0.05"
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-dvh w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 55% 70% at 78% 55%, rgba(242,107,31,0.28) 0%, transparent 55%), radial-gradient(ellipse 80% 100% at 20% 30%, rgba(46,95,232,0.12) 0%, transparent 60%), #06122F",
      }}
    >
      {/* grain overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0.15, mixBlendMode: "overlay" }}
        aria-hidden
      >
        <filter id="hero-grain">
          <feTurbulence baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* top nav — absolute, outside the grid */}
      <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-[60px]">
        <LogoMark tone="light" />
        <button
          onClick={onStart}
          className="rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Get started
        </button>
      </nav>

      {/* centered grid */}
      <div className="relative z-10 mx-auto grid min-h-dvh max-w-[1400px] grid-cols-1 items-center gap-[60px] px-6 py-24 md:grid-cols-2 md:px-[60px] md:py-10">
        {/* door column (right on desktop, above text on mobile) */}
        <div className="flex justify-center md:order-2">
          <GeorgianDoor className="float h-auto w-[250px] max-h-[68vh] md:w-[380px]" />
        </div>

        {/* text column */}
        <div className="flex flex-col md:order-1">
          {/* pill */}
          <div className="fade-up mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
            </span>
            For first-time buyers · Ireland
          </div>

          {/* headline */}
          <h1
            className="h max-w-[520px] text-white"
            style={{ fontSize: "clamp(44px, 6vw, 72px)", lineHeight: 1.05 }}
          >
            <span className="block overflow-hidden">
              <span className="line-inner block">Your first Irish home,</span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="accent serif-italic block text-orange"
                style={{ fontSize: "clamp(48px, 6.4vw, 76px)", lineHeight: 1.1 }}
              >
                unlocked.
              </span>
            </span>
          </h1>

          <p className="fade-up mt-7 max-w-[400px] text-[16px] leading-relaxed text-white/70">
            Six questions. Ninety seconds. The Irish government might hand you
            €30,000 by the end.
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-5">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2.5 rounded-full bg-orange px-8 py-4 text-[15px] font-medium text-white shadow-[0_18px_45px_-12px_rgba(242,107,31,0.7)] transition-colors hover:bg-[#ff7d33]"
            >
              Begin assessment
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <p className="text-[13px] text-white/50">
              90 seconds · no credit check
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
