"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type Answers } from "@/lib/calc";

const NAVY = "#06122F";
const ORANGE = "#F26B1F";

export default function QuestionScene({
  index,
  answers,
}: {
  index: number;
  answers: Answers;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[360px]"
        >
          {index === 0 && <IncomeScene />}
          {index === 1 && <CoApplicantScene />}
          {index === 2 && <DepositScene value={answers.savings} />}
          {index === 3 && <PriceScene value={answers.propertyPrice} />}
          {index === 4 && <NewBuildScene yes={answers.newBuild} />}
          {index === 5 && <FirstBuyerScene yes={answers.firstTimeBuyer} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Q1 — bar chart filling upward + "4× rule" callout */
function IncomeScene() {
  const bars = [42, 66, 54, 92, 120];
  return (
    <svg viewBox="0 0 220 190" className="w-full">
      <line x1="20" y1="150" x2="200" y2="150" stroke={NAVY} strokeWidth="1" opacity="0.3" />
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={30 + i * 34}
          y={150 - h}
          width="22"
          height={h}
          rx="2"
          fill={NAVY}
          opacity={0.85}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: "backOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        />
      ))}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <rect x="118" y="24" width="86" height="26" rx="13" fill="none" stroke={NAVY} strokeWidth="1" />
        <text x="161" y="41" textAnchor="middle" fill={NAVY} fontFamily="var(--font-inter)" fontSize="12" fontWeight="500">
          4× your income
        </text>
      </motion.g>
    </svg>
  );
}

/* Q2 — two rotating intersecting circles */
function CoApplicantScene() {
  return (
    <svg viewBox="0 0 220 190" className="w-full">
      <motion.g
        style={{ transformOrigin: "110px 95px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="88" cy="95" r="52" fill={NAVY} opacity="0.9" />
        <circle cx="132" cy="95" r="52" fill={ORANGE} opacity="0.3" />
      </motion.g>
      {/* overlap brighten */}
      <ellipse cx="110" cy="95" rx="16" ry="46" fill={ORANGE} opacity="0.28" />
      <text x="110" y="176" textAnchor="middle" fill={NAVY} opacity="0.6" fontFamily="var(--font-inter)" fontSize="12" fontWeight="500">
        Combined income
      </text>
    </svg>
  );
}

/* Q3 — stack of coins that grows with the value */
function DepositScene({ value }: { value: number }) {
  const coins = Math.max(1, Math.min(9, Math.round(value / 15000)));
  return (
    <svg viewBox="0 0 220 200" className="w-full">
      {Array.from({ length: coins }).map((_, i) => {
        const y = 178 - i * 15;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: "backOut" }}
          >
            <ellipse cx="110" cy={y} rx="42" ry="11" fill={NAVY} opacity={0.85} />
            <ellipse cx="110" cy={y - 3} rx="42" ry="11" fill="none" stroke={NAVY} strokeWidth="1" opacity="0.4" />
          </motion.g>
        );
      })}
      {[0, 1, 2].map((i) => (
        <motion.text
          key={`e${i}`}
          x={70 + i * 40}
          fill={NAVY}
          opacity="0.35"
          fontFamily="var(--font-inter)"
          fontSize="16"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: [120, 40], opacity: [0, 0.4, 0] }}
          transition={{ delay: i * 0.5, duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        >
          €
        </motion.text>
      ))}
    </svg>
  );
}

/* Q4 — terraced house line drawing that scales with the value */
function PriceScene({ value }: { value: number }) {
  const scale = 0.72 + Math.min(0.5, (value / 500000) * 0.5);
  return (
    <svg viewBox="0 0 220 200" className="w-full">
      <motion.g
        style={{ transformOrigin: "110px 150px" }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <g fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinejoin="round">
          {/* roofs (terrace) */}
          <path d="M40 90 L70 62 L100 90" />
          <path d="M100 90 L130 62 L160 90" />
          <path d="M160 90 L190 62 L220 90" transform="translate(-40 0)" />
          {/* facade */}
          <rect x="50" y="90" width="120" height="80" />
          {/* door */}
          <rect x="98" y="132" width="24" height="38" />
          {/* windows */}
          <rect x="62" y="102" width="24" height="20" />
          <rect x="134" y="102" width="24" height="20" />
          <rect x="62" y="132" width="24" height="20" />
          <rect x="134" y="132" width="24" height="20" />
        </g>
      </motion.g>
    </svg>
  );
}

/* Q5 — blueprint vs second-hand; Yes → blueprint glows + "€30k unlocked" */
function NewBuildScene({ yes }: { yes: boolean }) {
  return (
    <svg viewBox="0 0 240 200" className="w-full">
      {/* left: blueprint */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={20 + i * 20} y1="40" x2={20 + i * 20} y2="150" stroke={yes ? ORANGE : NAVY} strokeWidth="0.75" opacity={yes ? 0.4 : 0.2} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`h${i}`} x1="20" y1={40 + i * 22} x2="100" y2={40 + i * 22} stroke={yes ? ORANGE : NAVY} strokeWidth="0.75" opacity={yes ? 0.4 : 0.2} />
        ))}
        <path d="M30 130 L30 70 L60 50 L90 70 L90 130" fill="none" stroke={yes ? ORANGE : NAVY} strokeWidth="1.6" />
        <line x1="30" y1="160" x2="90" y2="160" stroke={yes ? ORANGE : NAVY} strokeWidth="1" />
        <text x="60" y="176" textAnchor="middle" fill={yes ? ORANGE : NAVY} opacity="0.7" fontFamily="var(--font-inter)" fontSize="10" fontWeight="500">
          New-build
        </text>
      </g>
      {/* right: second-hand */}
      <g opacity={yes ? 0.3 : 1}>
        <path d="M140 130 L140 78 L175 52 L210 78 L210 130 Z" fill="none" stroke={NAVY} strokeWidth="1.4" />
        <rect x="165" y="104" width="20" height="26" fill="none" stroke={NAVY} strokeWidth="1.2" />
        <text x="175" y="176" textAnchor="middle" fill={NAVY} opacity="0.6" fontFamily="var(--font-inter)" fontSize="10" fontWeight="500">
          Second-hand
        </text>
      </g>
      <AnimatePresence>
        {yes && (
          <motion.g
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <rect x="66" y="18" width="96" height="24" rx="12" fill={ORANGE} />
            <text x="114" y="34" textAnchor="middle" fill="#fff" fontFamily="var(--font-inter)" fontSize="12" fontWeight="600">
              €30k unlocked
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* Q6 — keys; Yes → key drops into lock and turns */
function FirstBuyerScene({ yes }: { yes: boolean }) {
  return (
    <svg viewBox="0 0 220 200" className="w-full">
      {/* lock */}
      <rect x="86" y="96" width="48" height="42" rx="6" fill="none" stroke={NAVY} strokeWidth="1.6" />
      <path d="M96 96 v-10 a14 14 0 0 1 28 0 v10" fill="none" stroke={NAVY} strokeWidth="1.6" />
      <circle cx="110" cy="114" r="4" fill={NAVY} />
      {/* key */}
      <motion.g
        initial={false}
        animate={
          yes
            ? { y: [-70, 0], rotate: [0, 0, 20] }
            : { y: -70, rotate: 0 }
        }
        transition={{ duration: 1, ease: "easeInOut", times: [0, 0.6, 1] }}
        style={{ transformOrigin: "110px 118px" }}
      >
        <line x1="110" y1="118" x2="110" y2="150" stroke={NAVY} strokeWidth="2.4" />
        <circle cx="110" cy="158" r="9" fill="none" stroke={NAVY} strokeWidth="2.4" />
        <line x1="114" y1="140" x2="120" y2="140" stroke={NAVY} strokeWidth="2.4" />
        <line x1="114" y1="132" x2="118" y2="132" stroke={NAVY} strokeWidth="2.4" />
      </motion.g>
    </svg>
  );
}
