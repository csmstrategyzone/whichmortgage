"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Brand from "@/components/Brand";
import GeorgianDoor from "@/components/GeorgianDoor";

export default function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grain relative min-h-dvh w-full overflow-hidden bg-navy">
      {/* warm radial glow, lower-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 70% at 78% 60%, rgba(242,107,31,0.13), transparent)",
        }}
      />

      {/* top nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Brand tone="light" />
        <div className="hidden items-center gap-7 md:flex">
          {["Buy", "Switch", "Guides", "Sign in"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[13px] font-normal text-white/65 transition-colors hover:text-white"
            >
              {l}
            </a>
          ))}
          <button
            onClick={onStart}
            className="rounded-[6px] bg-orange px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* content grid */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-8 md:grid-cols-[1.4fr_1fr] md:pt-16">
        {/* left column */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-[13px] font-normal text-white/60"
          >
            For first-time buyers in Ireland
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="display text-white"
            style={{ fontSize: "clamp(46px, 8.6vw, 82px)" }}
          >
            Your first Irish home,
            <br />
            <span
              className="em"
              style={{ fontSize: "clamp(48px, 9vw, 86px)" }}
            >
              unlocked.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-7 max-w-[400px] text-[16px] font-normal leading-relaxed text-white/65"
          >
            Answer six questions and we&apos;ll show you exactly what you can
            borrow, the schemes you qualify for, and where in Ireland you can
            afford to live.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2.5 rounded-[6px] bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
            >
              Begin assessment
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <p className="text-[13px] font-normal text-white/55">
              Takes 90 seconds · no credit check
            </p>
          </motion.div>
        </div>

        {/* right column — monoline door */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
          className="flex justify-center md:justify-end"
        >
          <GeorgianDoor className="h-[52vh] max-h-[520px] w-auto" />
        </motion.div>
      </div>
    </section>
  );
}
