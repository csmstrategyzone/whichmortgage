"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const PHOTO =
  "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=1600&q=85";

export default function HeroScreen({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!root.current) return;

    const ctx = gsap.context(() => {
      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".line-inner", {
          yPercent: 110,
          duration: 1,
          stagger: 0.15,
        })
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
      }
    }, root);

    // Subtle mouse parallax (cinematic depth in a fixed-viewport hero)
    const onMove = (e: MouseEvent) => {
      if (reduce) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      gsap.to(photo.current, { x: x * -24, y: y * -16, duration: 0.8, ease: "power2.out" });
      gsap.to(text.current, { x: x * 12, y: y * 8, duration: 0.8, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-dvh w-full items-stretch overflow-hidden bg-navy"
    >
      {/* Photograph layer (Ken Burns) */}
      <div
        ref={photo}
        className="kenburns absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${PHOTO}")` }}
      />
      {/* Navy gradient — opaque on the left, reveals the door on the right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,18,47,0.96) 0%, rgba(6,18,47,0.72) 38%, rgba(6,18,47,0.3) 62%, rgba(6,18,47,0) 100%)",
        }}
      />
      {/* Warm orange glow, bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 70%, rgba(242,107,31,0.25), transparent 60%)",
        }}
      />

      {/* Content */}
      <div
        ref={text}
        className="relative z-10 flex w-full max-w-6xl flex-col px-6 py-8 sm:px-10 md:w-[48%] md:justify-center md:py-16"
      >
        <div className="mb-auto md:mb-0">
          <LogoMark tone="light" />
        </div>

        <div className="mt-10 md:mt-8">
          {/* pill */}
          <div className="fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
            </span>
            For first-time buyers · Ireland
          </div>

          {/* headline */}
          <h1 className="h text-white" style={{ fontSize: "clamp(44px, 7.2vw, 84px)" }}>
            <span className="block overflow-hidden">
              <span className="line-inner block">Your first Irish home,</span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="accent serif-italic block text-orange"
                style={{ fontSize: "clamp(46px, 7.6vw, 88px)", lineHeight: 1.05 }}
              >
                unlocked.
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-6 max-w-[420px] text-[16px] leading-relaxed text-white/70"
          >
            Six questions. Ninety seconds. The Irish government might hand you
            €30,000 by the end.
          </p>

          <button
            onClick={onStart}
            className="fade-up group mt-8 inline-flex items-center gap-2.5 rounded-full bg-orange px-8 py-4 text-[15px] font-medium text-white shadow-[0_18px_45px_-12px_rgba(242,107,31,0.7)] transition-colors hover:bg-[#ff7d33]"
          >
            Begin assessment
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>

          <p className="fade-up mt-6 text-[13px] text-white/50">
            90 seconds · no credit check · no login
          </p>
        </div>
      </div>
    </section>
  );
}
