"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Brand from "@/components/Brand";
import { type Result, euro } from "@/lib/calc";

export default function LeadScreen({ result }: { result: Result }) {
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = /.+@.+\..+/.test(email) && gdpr;

  return (
    <section className="relative flex min-h-dvh w-full flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Brand tone="dark" />
        <span className="text-[13px] text-ink/55">
          Buying power {euro(result.buyingPower)}
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[8px] border bg-white p-8 shadow-[0_20px_60px_-30px_rgba(6,18,47,0.3)] hair-cream sm:p-10"
        >
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-orange/10">
                <Check className="h-6 w-6 text-orange" />
              </div>
              <h2 className="display text-navy" style={{ fontSize: "30px" }}>
                On its way.
              </h2>
              <p className="mt-3 text-[15px] text-ink/60">
                We&apos;ve sent your personalised report to {email}. A
                WhichMortgage broker will be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              <h2
                className="display text-navy"
                style={{ fontSize: "clamp(28px, 5vw, 36px)" }}
              >
                Save your personalised{" "}
                <span className="em">report.</span>
              </h2>
              <p className="mt-3 text-[15px] text-ink/60">
                We&apos;ll email your buying power, schemes, and 30-day plan.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid) setSent(true);
                }}
                className="mt-7 space-y-4"
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
                    className="w-full rounded-[4px] border bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow hair-cream focus:shadow-[0_0_0_3px_rgba(242,107,31,0.12)]"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={gdpr}
                    onChange={(e) => setGdpr(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-orange"
                  />
                  <span className="text-[13px] leading-snug text-ink/60">
                    I agree to WhichMortgage contacting me about my mortgage and
                    storing my details in line with their privacy policy.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!valid}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition enabled:hover:bg-[#ff7d33] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send my report
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>

                <button
                  type="button"
                  className="w-full rounded-[6px] border px-7 py-3.5 text-[15px] font-medium text-navy transition-colors hover:bg-navy/5"
                  style={{ borderColor: "rgba(6,18,47,0.25)" }}
                >
                  Book a call with a broker
                </button>
              </form>
            </>
          )}
        </motion.div>

        <p className="mt-6 text-center text-[12px] text-ink/45">
          Regulated by the Central Bank of Ireland · © WhichMortgage 2026
        </p>
      </div>
    </section>
  );
}
