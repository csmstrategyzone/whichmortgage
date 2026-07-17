"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Brand from "@/components/Brand";
import { type Answers, type Result } from "@/lib/calc";

export default function PlanScreen({
  answers,
  result,
  onContinue,
}: {
  answers: Answers;
  result: Result;
  onContinue: () => void;
}) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            income: answers.income,
            coApplicantIncome: answers.coApplicantIncome,
            deposit: result.deposit,
            propertyPrice: answers.propertyPrice,
            newBuild: answers.newBuild,
            firstTimeBuyer: answers.firstTimeBuyer,
            buyingPower: result.buyingPower,
            htbAmount: result.htb,
          }),
        });

        if (!res.body) {
          setText("We couldn't reach your coach just now. Please try again.");
          setDone(true);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { value, done: streamDone } = await reader.read();
          if (streamDone) break;
          setText((t) => t + decoder.decode(value, { stream: true }));
        }
        setDone(true);
      } catch {
        setDone(true);
      }
    })();

    return () => controller.abort();
  }, [answers, result]);

  return (
    <section className="relative flex min-h-dvh w-full flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Brand tone="dark" />
        <span className="text-[13px] text-ink/55">Your personalised plan</span>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[8px] border bg-white p-8 shadow-[0_20px_60px_-30px_rgba(6,18,47,0.3)] hair-cream sm:p-10"
        >
          <h2
            className="h text-navy"
            style={{ fontSize: "clamp(30px, 5vw, 44px)" }}
          >
            Your 30-day plan
          </h2>

          <div className="mt-6 min-h-[180px] whitespace-pre-wrap text-[16px] leading-relaxed text-ink/80">
            {text}
            {!done && <span className="cursor-blink align-middle" />}
          </div>
        </motion.div>

        {done && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onContinue}
            className="group mt-8 inline-flex items-center gap-2.5 self-start rounded-[6px] bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
          >
            Save your plan
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </motion.button>
        )}
      </div>
    </section>
  );
}
