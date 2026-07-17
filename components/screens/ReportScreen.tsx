"use client";

import { motion } from "framer-motion";
import { Download, Mail, ArrowRight } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import Ticker, { easeOutExpo } from "@/components/Ticker";
import IrelandMap from "@/components/IrelandMap";
import {
  type Answers,
  type Result,
  affordableCities,
  stretchCities,
  euro,
  num,
} from "@/lib/calc";

export default function ReportScreen({
  answers,
  result,
  onContinue,
}: {
  answers: Answers;
  result: Result;
  onContinue: () => void;
}) {
  const affordable = affordableCities(result.buyingPower);
  const stretch = stretchCities(result.buyingPower);

  const total = result.buyingPower || 1;
  const depPct = (result.deposit / total) * 100;
  const htbPct = (result.htb / total) * 100;
  const borPct = (result.borrowing / total) * 100;

  return (
    <section className="relative min-h-dvh w-full bg-cream">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <LogoMark tone="dark" />
          <span className="hidden text-[13px] text-ink/55 sm:inline">
            Your assessment · confidential
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] text-navy transition-colors hover:bg-navy/5" style={{ borderColor: "rgba(6,18,47,0.25)" }}>
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] text-navy transition-colors hover:bg-navy/5" style={{ borderColor: "rgba(6,18,47,0.25)" }}>
            <Mail className="h-3.5 w-3.5" /> Email me
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 pb-16 md:px-10">
        {/* buying power */}
        <p className="mt-6 text-[13px] font-medium text-navy/60">
          Your buying power
        </p>
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex items-baseline text-navy"
        >
          <span className="h text-navy/40" style={{ fontSize: "46px" }}>
            €
          </span>
          <span className="h" style={{ fontSize: "clamp(66px, 13vw, 132px)", lineHeight: 1 }}>
            <Ticker value={result.buyingPower} from={0} duration={1800} easing={easeOutExpo} format={(n) => num(n)} />
          </span>
        </motion.div>
        <p className="mt-2 text-navy/70">
          <span className="serif-italic" style={{ fontSize: "22px" }}>
            {answers.firstTimeBuyer
              ? "as a first-time buyer in Ireland"
              : "based on your assessment"}
          </span>
        </p>

        {/* proportion bar */}
        <div className="mt-8 flex h-3 w-full overflow-hidden rounded-full">
          <motion.div initial={{ width: 0 }} animate={{ width: `${depPct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="bg-navy" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${htbPct}%` }} transition={{ duration: 1, delay: 0.15, ease: "easeOut" }} className="bg-orange" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${borPct}%` }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className="bg-navy/60" />
        </div>

        {/* breakdown */}
        <div className="mt-8 grid grid-cols-1 border-t sm:grid-cols-3 hair-cream">
          <Cell label="Your deposit" value={euro(result.deposit)} pct={depPct} />
          <Cell label="Help to Buy" value={euro(result.htb)} pct={htbPct} accent divider />
          <Cell label="Your borrowing" value={euro(result.borrowing)} pct={borPct} divider />
        </div>

        {/* map */}
        <div className="mt-14 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="h text-navy" style={{ fontSize: "clamp(28px, 4.6vw, 40px)" }}>
              Where you can live
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink/60">
              Based on median asking prices, here&apos;s where your buying power
              stretches across Ireland today.
            </p>
            <div className="mt-6 space-y-3">
              <Legend marker={<span className="inline-block h-3 w-3 rounded-full bg-navy" />} label="Comfortable" sub="Buying power covers the median" />
              <Legend marker={<span className="inline-block h-3 w-3 rounded-full border-[1.5px] border-navy" />} label="Within reach" sub="A short stretch from the median" />
              <Legend marker={<span className="inline-block h-3 w-3 rounded-full border-[1.5px] border-orange" />} label="Best match" sub="The most you can comfortably afford" />
            </div>
          </div>

          <div className="flex justify-center">
            <IrelandMap affordableCities={affordable} stretchCities={stretch} className="h-auto w-full max-w-[380px]" />
          </div>
        </div>

        {/* actions */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t pt-8 hair-cream sm:flex-row sm:items-center">
          <button
            onClick={onContinue}
            className="group inline-flex items-center gap-2.5 rounded-full bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
          >
            Begin application
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
          <button
            onClick={onContinue}
            className="rounded-full border px-7 py-3.5 text-[15px] font-medium text-navy transition-colors hover:bg-navy/5"
            style={{ borderColor: "rgba(6,18,47,0.25)" }}
          >
            Book a broker call
          </button>
          <p className="text-[12px] text-ink/45 sm:ml-auto">
            Regulated by the Central Bank of Ireland
          </p>
        </div>
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  pct,
  accent,
  divider,
}: {
  label: string;
  value: string;
  pct: number;
  accent?: boolean;
  divider?: boolean;
}) {
  return (
    <div className={`px-1 py-5 sm:px-6 ${divider ? "sm:border-l" : ""} hair-cream`}>
      <p className="text-[13px] text-ink/55">{label}</p>
      <p className={`mt-1 h ${accent ? "text-orange" : "text-navy"}`} style={{ fontSize: "30px" }}>
        {value}
      </p>
      <p className="mt-0.5 text-[12px] text-ink/45">{Math.round(pct)}% of total</p>
    </div>
  );
}

function Legend({
  marker,
  label,
  sub,
}: {
  marker: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {marker}
      <div>
        <p className="text-[14px] font-medium text-ink">{label}</p>
        <p className="text-[12px] text-ink/50">{sub}</p>
      </div>
    </div>
  );
}
