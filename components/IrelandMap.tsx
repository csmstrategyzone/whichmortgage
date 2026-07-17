"use client";

import { motion } from "framer-motion";
import { CITY_PRICES } from "@/lib/calc";

interface Props {
  affordableCities: string[]; // comfortable — navy filled dot
  stretchCities: string[]; // within reach — navy outline dot
  className?: string;
}

interface City {
  name: string;
  cx: number;
  cy: number;
  lx: number;
  ly: number;
  anchor: "start" | "end" | "middle";
}

const CITIES: City[] = [
  { name: "Dublin", cx: 358, cy: 230, lx: 372, ly: 234, anchor: "start" },
  { name: "Galway", cx: 152, cy: 255, lx: 138, ly: 250, anchor: "end" },
  { name: "Limerick", cx: 200, cy: 330, lx: 186, ly: 333, anchor: "end" },
  { name: "Cork", cx: 215, cy: 410, lx: 215, ly: 434, anchor: "middle" },
  { name: "Waterford", cx: 315, cy: 380, lx: 330, ly: 384, anchor: "start" },
];

// Accurate-ish Ireland silhouette (from the supplied path).
const IRELAND =
  "M 280 50 C 260 45, 245 55, 235 65 C 220 55, 200 60, 190 75 " +
  "C 175 65, 155 70, 145 85 C 130 80, 115 90, 108 105 " +
  "C 95 100, 78 105, 72 120 C 58 118, 45 130, 42 148 " +
  "C 30 152, 22 168, 25 185 C 15 195, 12 215, 22 232 " +
  "C 14 245, 18 265, 30 275 C 22 292, 30 312, 45 320 " +
  "C 42 340, 55 355, 72 358 C 68 378, 82 392, 100 392 " +
  "C 105 410, 122 420, 140 415 C 152 430, 175 432, 190 422 " +
  "C 208 435, 232 432, 245 420 C 265 428, 290 422, 302 405 " +
  "C 325 408, 345 395, 350 375 C 372 372, 388 355, 388 335 " +
  "C 405 328, 415 308, 410 288 C 425 275, 430 252, 420 232 " +
  "C 432 218, 432 195, 420 180 C 428 162, 420 142, 405 132 " +
  "C 412 115, 402 95, 385 90 C 388 72, 372 58, 355 60 " +
  "C 348 45, 328 40, 315 48 C 305 38, 290 42, 280 50 Z";

const WAVES = [
  "M 60 350 q 8 -5 16 0 t 16 0",
  "M 440 250 q 8 -5 16 0 t 16 0",
  "M 420 480 q 8 -5 16 0 t 16 0",
  "M 70 150 q 8 -5 16 0 t 16 0",
];

export default function IrelandMap({
  affordableCities,
  stretchCities,
  className,
}: Props) {
  // Best match = priciest city you can comfortably afford; else the priciest
  // one within reach.
  const byPrice = (names: string[]) =>
    names
      .slice()
      .sort((a, b) => (CITY_PRICES[b] ?? 0) - (CITY_PRICES[a] ?? 0))[0];
  const bestMatch = byPrice(affordableCities) ?? byPrice(stretchCities) ?? null;

  return (
    <svg
      viewBox="0 0 500 620"
      className={className}
      role="img"
      aria-label="Map of Ireland showing where you can afford to live"
    >
      <path d={IRELAND} fill="#EFE8D9" stroke="#06122F" strokeWidth="1.2" strokeLinejoin="round" />

      {WAVES.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="#2E5FE8"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}

      {CITIES.map((c, i) => {
        const comfortable = affordableCities.includes(c.name);
        const reach = stretchCities.includes(c.name);
        const isBest = c.name === bestMatch;
        return (
          <g key={c.name}>
            {isBest && (
              <circle cx={c.cx} cy={c.cy} r="12" fill="none" stroke="#F26B1F" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <motion.circle
              cx={c.cx}
              cy={c.cy}
              r="5"
              fill={comfortable ? "#06122F" : "#EFE8D9"}
              stroke="#06122F"
              strokeWidth={comfortable ? 0 : 1.4}
              opacity={comfortable || reach ? 1 : 0.35}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 260 }}
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
            />
            <text
              x={c.lx}
              y={c.ly}
              textAnchor={c.anchor}
              fill="#06122F"
              fillOpacity={comfortable || reach ? 1 : 0.5}
              fontFamily="var(--font-inter)"
              fontWeight={500}
              fontSize="11"
            >
              {c.name}
            </text>
          </g>
        );
      })}

      {bestMatch && (
        <text
          x="250"
          y="600"
          textAnchor="middle"
          fill="#06122F"
          fillOpacity="0.55"
          fontFamily="var(--font-inter)"
          fontWeight={500}
          fontSize="13"
        >
          Best match · {bestMatch}
        </text>
      )}
    </svg>
  );
}
