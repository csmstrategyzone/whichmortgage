"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Lock, Landmark } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { type Result, euro } from "@/lib/calc";

export default function LeadScreen({ result }: { result: Result }) {
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = /.+@.+\..+/.test(email) && gdpr;

  return (
    <section className="relative flex min-h-dvh w-full flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 md:px-10">
        <LogoMark tone="dark" />
        <span className="text-[13px] text-ink/55">
          Buying power {euro(result.buyingPower)}
        </span>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-center gap-12 px-6 pb-16 md:grid-cols-2 md:px-10">
        {/* form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sent ? (
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-navy">
                <Check className="h-6 w-6 text-cream" />
              </div>
              <h2 className="h text-navy" style={{ fontSize: "36px" }}>
                On its way.
              </h2>
              <p className="mt-3 max-w-sm text-[15px] text-ink/60">
                We&apos;ve sent your report to {email}. A WhichMortgage broker
                will be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="h text-navy" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
                Save your personalised report
              </h2>
              <p className="mt-3 max-w-sm text-[15px] text-ink/60">
                We&apos;ll email your buying power, schemes, and 30-day plan.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid) setSent(true);
                }}
                className="mt-7 max-w-sm space-y-4"
              >
                <div>
                  <label className="mb-1 block text-[12px] text-ink/50">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.ie"
                    className="w-full border-b-2 border-navy/25 bg-transparent py-2 text-[18px] text-navy outline-none transition-colors placeholder:text-navy/30 focus:border-navy"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={gdpr}
                    onChange={(e) => setGdpr(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-navy"
                  />
                  <span className="text-[13px] leading-snug text-ink/60">
                    I agree to WhichMortgage contacting me about my mortgage and
                    storing my details in line with their privacy policy.
                  </span>
                </label>

                {/* trust row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[12px] text-ink/55">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> GDPR compliant
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> No credit check
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5" /> Regulated by CBI
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!valid}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition enabled:hover:bg-[#ff7d33] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send my report
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border px-7 py-3.5 text-[15px] font-medium text-navy transition-colors hover:bg-navy/5"
                  style={{ borderColor: "rgba(6,18,47,0.25)" }}
                >
                  Book a call with a broker
                </button>
              </form>
            </>
          )}
        </motion.div>

        {/* preview card */}
        <div className="group hidden justify-center [perspective:1200px] md:flex">
          <div className="w-full max-w-[300px] rounded-[10px] border bg-white p-7 shadow-[0_30px_70px_-30px_rgba(6,18,47,0.4)] transition-transform duration-500 hair-cream [transform:rotateY(-8deg)_rotateX(4deg)] group-hover:[transform:rotateY(0deg)_rotateX(0deg)]">
            <div className="mb-5 flex items-center justify-between">
              <LogoMark tone="dark" hideWord />
              <span className="text-[10px] uppercase tracking-wide text-ink/40">
                Report
              </span>
            </div>
            <p className="text-[11px] text-ink/50">Your buying power</p>
            <p className="h text-navy" style={{ fontSize: "40px" }}>
              {euro(result.buyingPower)}
            </p>
            <div className="mt-5 space-y-2.5">
              {[
                `${result.htbEligible ? "3" : "2"} schemes qualified`,
                "30-day action plan",
                "Where you can live",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-[13px] text-ink/70">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy/10">
                    <Check className="h-2.5 w-2.5 text-navy" />
                  </span>
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-cream">
              <div className="h-full w-2/3 rounded-full bg-orange" />
            </div>
          </div>
        </div>
      </div>

      <p className="pb-6 text-center text-[12px] text-ink/45">
        Regulated by the Central Bank of Ireland · © WhichMortgage 2026
      </p>
    </section>
  );
}
