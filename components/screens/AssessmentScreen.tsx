"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import QuestionScene from "@/components/QuestionScenes";
import { type Answers, num } from "@/lib/calc";

interface Props {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onComplete: () => void;
}

type Field = keyof Answers;

interface Question {
  field: Field;
  kind: "currency" | "bool";
  category: string;
  label: string;
  hint: string;
  optional?: boolean;
  chips?: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  {
    field: "income",
    kind: "currency",
    category: "Your income",
    label: "How much do you earn a year?",
    hint: "Your gross annual salary, before tax.",
    chips: [
      { label: "€30k", value: 30000 },
      { label: "€40k", value: 40000 },
      { label: "€50k", value: 50000 },
      { label: "€60k", value: 60000 },
      { label: "€80k+", value: 80000 },
    ],
  },
  {
    field: "coApplicantIncome",
    kind: "currency",
    category: "Co-applicant",
    label: "Is anyone buying with you?",
    hint: "Add their gross salary. Leave at zero if buying alone.",
    optional: true,
    chips: [
      { label: "€0", value: 0 },
      { label: "€30k", value: 30000 },
      { label: "€40k", value: 40000 },
      { label: "€50k", value: 50000 },
      { label: "€60k", value: 60000 },
    ],
  },
  {
    field: "savings",
    kind: "currency",
    category: "Your deposit",
    label: "How much have you saved?",
    hint: "Everything you can put towards a deposit, including gifts.",
    chips: [
      { label: "€20k", value: 20000 },
      { label: "€40k", value: 40000 },
      { label: "€60k", value: 60000 },
      { label: "€80k", value: 80000 },
      { label: "€100k+", value: 100000 },
    ],
  },
  {
    field: "propertyPrice",
    kind: "currency",
    category: "Target home",
    label: "What's the home worth?",
    hint: "Roughly what you hope to spend.",
    chips: [
      { label: "€250k", value: 250000 },
      { label: "€300k", value: 300000 },
      { label: "€350k", value: 350000 },
      { label: "€450k", value: 450000 },
      { label: "€500k+", value: 500000 },
    ],
  },
  {
    field: "newBuild",
    kind: "bool",
    category: "Property type",
    label: "Is it a new-build?",
    hint: "New-builds can unlock the Help to Buy scheme.",
  },
  {
    field: "firstTimeBuyer",
    kind: "bool",
    category: "Your status",
    label: "Are you a first-time buyer?",
    hint: "You've never owned a home, here or abroad.",
  },
];

export default function AssessmentScreen({
  answers,
  setAnswers,
  onComplete,
}: Props) {
  const [i, setI] = useState(0);
  const q = QUESTIONS[i];
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captureRef.current?.focus();
  }, [i]);

  const setField = (field: Field, value: number | boolean) =>
    setAnswers((a) => ({ ...a, [field]: value }));

  const canAdvance = useMemo(() => {
    if (q.optional) return true;
    if (q.kind === "currency") return (answers[q.field] as number) > 0;
    return true;
  }, [q, answers]);

  const next = () => {
    if (!canAdvance) return;
    if (i < QUESTIONS.length - 1) setI(i + 1);
    else onComplete();
  };
  const back = () => i > 0 && setI(i - 1);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      next();
      return;
    }
    if (q.kind !== "currency") return;
    const cur = answers[q.field] as number;
    if (e.key === "Backspace") {
      setField(q.field, Math.floor(cur / 10));
    } else if (/^[0-9]$/.test(e.key)) {
      const nv = cur * 10 + parseInt(e.key, 10);
      if (nv <= 99_999_999) setField(q.field, nv);
    }
  };

  const progress = (i + 1) / QUESTIONS.length;

  return (
    <section className="flex min-h-dvh w-full flex-col bg-cream md:flex-row">
      {/* LEFT — content (55%) */}
      <div
        ref={captureRef}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="flex w-full flex-col outline-none md:w-[55%]"
      >
        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <LogoMark tone="dark" />
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-ink/55">
              Question {i + 1} of {QUESTIONS.length}
            </span>
            <div className="h-[3px] w-[120px] overflow-hidden rounded-full bg-ink/10">
              <motion.div
                className="h-full rounded-full bg-navy"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 pb-24 md:px-12 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-lg"
            >
              <p className="mb-3 text-[12px] font-medium text-navy/60">
                {q.category}
                {q.optional && (
                  <span className="text-ink/35"> · optional</span>
                )}
              </p>

              <h2
                className="h text-navy"
                style={{ fontSize: "clamp(30px, 4.6vw, 44px)" }}
              >
                {q.label}
              </h2>

              {q.kind === "currency" ? (
                <>
                  <div
                    onClick={() => captureRef.current?.focus()}
                    className="mt-8 cursor-text border-b-2 border-navy/25 pb-2 transition-colors focus-within:border-navy"
                  >
                    <span
                      className="flex items-center text-navy"
                      style={{ fontSize: "36px", fontWeight: 400, letterSpacing: "-0.01em" }}
                    >
                      €{num(answers[q.field] as number)}
                      <span className="cursor-blink" />
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] text-ink/55">{q.hint}</p>

                  {q.chips && (
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {q.chips.map((chip) => {
                        const selected =
                          (answers[q.field] as number) === chip.value;
                        return (
                          <button
                            key={chip.label}
                            onClick={() => {
                              setField(q.field, chip.value);
                              captureRef.current?.focus();
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] transition-all ${
                              selected
                                ? "border-navy bg-navy text-cream"
                                : "border-ink/20 text-ink/70 hover:border-ink/40"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" />}
                            {chip.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {[
                      { label: "Yes", v: true },
                      { label: "No", v: false },
                    ].map(({ label, v }) => {
                      const active = (answers[q.field] as boolean) === v;
                      return (
                        <button
                          key={label}
                          onClick={() => setField(q.field, v)}
                          className={`rounded-[8px] border px-6 py-10 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(6,18,47,0.5)] ${
                            active
                              ? "border-navy bg-navy text-cream"
                              : "border-ink/20 bg-cream text-navy"
                          }`}
                        >
                          <span
                            className="h block"
                            style={{ fontSize: "32px" }}
                          >
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[13px] text-ink/55">{q.hint}</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* bottom bar */}
        <footer className="sticky bottom-0 border-t bg-cream/90 backdrop-blur hair-cream">
          <div className="flex items-center justify-between px-6 py-4 md:px-12">
            <button
              onClick={back}
              disabled={i === 0}
              className="inline-flex items-center gap-1.5 text-[14px] text-ink/60 transition-colors enabled:hover:text-ink disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={next}
              disabled={!canAdvance}
              className="inline-flex items-center gap-2 rounded-[6px] bg-navy px-6 py-3 text-[14px] font-medium text-cream transition enabled:hover:bg-[#0b1e4d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {i === QUESTIONS.length - 1 ? "See my report" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>

      {/* RIGHT — ambient scene (45%) */}
      <div
        className="relative hidden items-center justify-center border-l px-10 md:flex md:w-[45%] hair-cream"
        style={{ background: "rgba(6,18,47,0.035)" }}
      >
        <QuestionScene index={i} answers={answers} />
      </div>
    </section>
  );
}
