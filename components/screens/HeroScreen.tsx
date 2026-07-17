"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";

const NAV = ["Mortgages", "Switch mortgage", "Schemes", "Guides"];

const rise = (y: number, delay: number, duration: number) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: "easeOut" as const },
});

export default function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex min-h-dvh w-full flex-col bg-[#0A2472]">
      {/* top nav */}
      <nav className="flex items-center justify-between bg-[#F5F0E8] px-6 py-5 md:px-10">
        <Logo />
        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((l) => (
            <button
              key={l}
              className="text-[14px] font-medium text-[#0A2472] transition-opacity hover:opacity-60"
            >
              {l} <span className="text-[10px]">▾</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onStart}
            className="hidden rounded-full border border-[#0A2472]/40 px-4 py-2 text-[14px] font-medium text-[#0A2472] transition-colors hover:bg-[#0A2472]/5 sm:inline-flex"
          >
            Log in →
          </button>
          <button
            onClick={onStart}
            className="rounded-full bg-orange px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
          >
            Get started →
          </button>
          <button className="text-[#0A2472] lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* hero — photo fades into the navy background (no hard split) */}
      <div className="relative flex-1 md:min-h-[620px]">
        {/* PHOTO — above text on mobile, absolute right on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="relative h-[300px] w-full overflow-hidden md:absolute md:right-0 md:top-0 md:h-full md:w-[75%]"
        >
          <Image
            src="/hero-couple.jpg"
            alt="Happy Irish couple at home"
            fill
            priority={true}
            quality={95}
            sizes="(max-width: 768px) 100vw, 75vw"
            className="kenburns hero-photo"
            style={{ objectFit: "cover" }}
          />
          {/* contrast overlay — masked with the same fade so it can't
              create a hard boundary against the navy */}
          <div
            className="hero-photo pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at right, transparent 0%, rgba(10,36,114,0.3) 100%)",
            }}
          />
          {/* regulator badge — bottom-right over the photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3.5 py-2 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-[#2F9E63]" />
            <span className="text-[11px] font-medium text-[#0A2472]">
              Regulated by Central Bank of Ireland
            </span>
          </motion.div>
        </motion.div>

        {/* TEXT — sits over the solid-navy left, above the fading photo */}
        <div className="relative z-[2] flex flex-col justify-center bg-transparent px-6 py-14 md:min-h-[620px] md:w-[55%] md:px-[60px] md:py-[70px] md:pr-[8%]">
          <motion.p
            {...rise(24, 0.1, 0.7)}
            className="mb-8 italic text-[#F4A574]"
            style={{ fontFamily: "var(--font-fraunces)", fontWeight: 400, fontSize: "22px" }}
          >
            Ireland&apos;s smartest
          </motion.p>

          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
            className="mb-11"
          >
            <motion.span
              {...rise(24, 0.25, 0.8)}
              className="block text-orange"
              style={{ fontWeight: 500, fontSize: "clamp(44px, 5.4vw, 76px)" }}
            >
              You don&apos;t need to
            </motion.span>
            <motion.span
              {...rise(24, 0.4, 0.8)}
              className="block text-orange"
              style={{ fontWeight: 500, fontSize: "clamp(44px, 5.4vw, 76px)" }}
            >
              know the schemes.
            </motion.span>
            <motion.span
              {...rise(24, 0.6, 0.9)}
              className="block italic text-[#2E5FE8]"
              style={{ fontWeight: 500, fontSize: "clamp(48px, 6vw, 84px)" }}
            >
              We do.
            </motion.span>
          </h1>

          <motion.p
            {...rise(14, 0.85, 0.7)}
            className="mb-11 max-w-[480px] text-[15px] text-white/80"
            style={{ lineHeight: 1.65 }}
          >
            Answer six questions and we&apos;ll show you exactly what you can
            borrow, which Irish schemes you qualify for — Help to Buy, First
            Home, Fresh Start — and where in Ireland you can actually afford to
            live. Ninety seconds, no credit check.
          </motion.p>

          <motion.div {...rise(14, 1, 0.7)}>
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-orange px-[30px] py-4 text-[14px] font-medium text-orange transition-colors hover:bg-orange hover:text-white"
            >
              Begin assessment
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[5px]" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Nav logo — orange house + "WhichMortgage" wordmark */
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path
          d="M12 3 L21 11 L18.5 11 L18.5 20 L14 20 L14 14 L10 14 L10 20 L5.5 20 L5.5 11 L3 11 Z"
          fill="#F26B1F"
        />
      </svg>
      <span style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.01em" }}>
        <span className="text-[#0A2472]">Which</span>
        <span className="text-orange">Mortgage</span>
      </span>
    </div>
  );
}
