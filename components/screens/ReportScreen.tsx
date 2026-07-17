"use client";

import { Download, Mail, ArrowRight } from "lucide-react";
import Brand from "@/components/Brand";
import Ticker from "@/components/Ticker";
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

  return (
    <section className="relative min-h-dvh w-full bg-cream">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-baseline gap-3">
          <Brand tone="dark" />
          <span className="text-[13px] text-ink/55">Your buyer assessment</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] text-ink/70 transition-colors hair-cream hover:border-ink/35">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] text-ink/70 transition-colors hair-cream hover:border-ink/35">
            <Mail className="h-3.5 w-3.5" /> Email me
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 pb-16">
        {/* buying power */}
        <p className="mt-6 text-[13px] text-ink/55">Your buying power</p>
        <div className="flex items-baseline text-navy">
          <span className="font-serif font-light text-ink/40" style={{ fontSize: "46px" }}>
            €
          </span>
          <span
            className="font-serif font-light"
            style={{ fontSize: "clamp(64px, 13vw, 124px)", letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            <Ticker value={result.buyingPower} duration={1400} format={(n) => num(n)} />
          </span>
        </div>
        <p className="mt-2 font-serif italic font-light text-ink/60" style={{ fontSize: "20px" }}>
          {answers.firstTimeBuyer
            ? "as a first-time buyer in Ireland"
            : "based on your assessment"}
        </p>

        {/* three-column breakdown */}
        <div className="mt-10 grid grid-cols-1 border-t sm:grid-cols-3 hair-cream">
          <Cell label="Your deposit" value={euro(result.deposit)} />
          <Cell
            label="Help to Buy"
            value={euro(result.htb)}
            accent
            divider
          />
          <Cell label="Your borrowing" value={euro(result.borrowing)} divider />
        </div>

        {/* map + where you can live */}
        <div className="mt-14 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="display text-ink" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
              Where you can <span className="em">live.</span>
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink/60">
              Based on median asking prices, here&apos;s where your buying power
              stretches across Ireland today.
            </p>
            <div className="mt-6 space-y-3">
              <Legend
                marker={<span className="inline-block h-3 w-3 rounded-full bg-black" />}
                label="Comfortable"
                sub="Buying power covers the median"
              />
              <Legend
                marker={
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-black bg-white" />
                }
                label="Within reach"
                sub="A short stretch from the median"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <IrelandMap
              affordableCities={affordable}
              stretchCities={stretch}
              className="h-auto w-full max-w-[420px]"
            />
          </div>
        </div>

        {/* bottom actions */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t pt-8 hair-cream sm:flex-row sm:items-center">
          <button
            onClick={onContinue}
            className="group inline-flex items-center gap-2.5 rounded-[6px] bg-orange px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#ff7d33]"
          >
            Begin application
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
          <button
            onClick={onContinue}
            className="rounded-[6px] border px-7 py-3.5 text-[15px] font-medium text-navy transition-colors hair-cream hover:bg-navy/5"
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
  accent,
  divider,
}: {
  label: string;
  value: string;
  accent?: boolean;
  divider?: boolean;
}) {
  return (
    <div
      className={`px-1 py-5 sm:px-6 ${divider ? "sm:border-l" : ""} hair-cream`}
    >
      <p className="text-[13px] text-ink/55">{label}</p>
      <p
        className={`mt-1 font-serif font-light ${accent ? "text-orange" : "text-navy"}`}
        style={{ fontSize: "30px", letterSpacing: "-0.02em" }}
      >
        {value}
      </p>
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
