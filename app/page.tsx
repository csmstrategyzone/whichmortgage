"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Answers, computeResult } from "@/lib/calc";
import HeroScreen from "@/components/screens/HeroScreen";
import AssessmentScreen from "@/components/screens/AssessmentScreen";
import SchemeRevealScreen from "@/components/screens/SchemeRevealScreen";
import ReportScreen from "@/components/screens/ReportScreen";
import PlanScreen from "@/components/screens/PlanScreen";
import LeadScreen from "@/components/screens/LeadScreen";

type Step = "hero" | "assessment" | "scheme" | "report" | "plan" | "lead";

const INITIAL: Answers = {
  income: 0,
  coApplicantIncome: 0,
  savings: 0,
  propertyPrice: 0,
  newBuild: false,
  firstTimeBuyer: false,
};

export default function Home() {
  const [step, setStep] = useState<Step>("hero");
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const result = useMemo(() => computeResult(answers), [answers]);

  const screen = (() => {
    switch (step) {
      case "hero":
        return <HeroScreen key="hero" onStart={() => setStep("assessment")} />;
      case "assessment":
        return (
          <AssessmentScreen
            key="assessment"
            answers={answers}
            setAnswers={setAnswers}
            onComplete={() =>
              setStep(computeResult(answers).htbEligible ? "scheme" : "report")
            }
          />
        );
      case "scheme":
        return (
          <SchemeRevealScreen
            key="scheme"
            htb={result.htb}
            onContinue={() => setStep("report")}
          />
        );
      case "report":
        return (
          <ReportScreen
            key="report"
            answers={answers}
            result={result}
            onContinue={() => setStep("plan")}
          />
        );
      case "plan":
        return (
          <PlanScreen
            key="plan"
            answers={answers}
            result={result}
            onContinue={() => setStep("lead")}
          />
        );
      case "lead":
        return <LeadScreen key="lead" result={result} />;
    }
  })();

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {screen}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
