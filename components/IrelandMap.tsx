"use client";

import { motion } from "framer-motion";

interface Props {
  affordableCities: string[]; // comfortable — solid black dot
  stretchCities: string[]; // within reach — hollow dot
  className?: string;
}

interface City {
  name: string;
  label: string;
  cx: number;
  cy: number;
  lx: number;
  ly: number;
  anchor: "start" | "end";
}

const CITIES: City[] = [
  { name: "Dublin", label: "DUBLIN", cx: 290, cy: 180, lx: 305, ly: 184, anchor: "start" },
  { name: "Galway", label: "GALWAY", cx: 130, cy: 200, lx: 118, ly: 188, anchor: "end" },
  { name: "Limerick", label: "LIMERICK", cx: 160, cy: 290, lx: 148, ly: 294, anchor: "end" },
  { name: "Cork", label: "CORK", cx: 180, cy: 380, lx: 180, ly: 402, anchor: "start" },
  { name: "Waterford", label: "WATERFORD", cx: 270, cy: 340, lx: 285, ly: 344, anchor: "start" },
];

// Ireland silhouette — refined west-coast jaggedness + Cork/Kerry peninsula.
const IRELAND =
  "M 220 40 Q 195 30 175 45 Q 155 35 140 55 Q 115 45 100 70 Q 80 60 70 85 " +
  "Q 50 80 45 105 Q 25 115 30 145 Q 15 165 30 195 Q 20 220 40 240 " +
  "Q 30 270 55 285 Q 50 315 80 325 Q 75 355 105 355 Q 98 372 118 372 " +
  "Q 125 392 150 384 Q 160 405 188 396 Q 198 378 176 372 Q 205 360 210 388 " +
  "Q 220 412 246 400 Q 275 410 295 385 Q 325 385 335 355 Q 360 350 360 320 " +
  "Q 380 305 370 275 Q 390 260 375 230 Q 385 205 370 180 Q 385 155 365 130 " +
  "Q 375 105 350 95 Q 355 70 330 65 Q 325 45 300 50 Q 285 35 265 45 Q 245 30 220 40 Z";

const WAVES = [
  "M 30 250 q 8 -6 16 0 t 16 0",
  "M 36 315 q 8 -6 16 0 t 16 0",
  "M 342 402 q 8 -6 16 0 t 16 0",
  "M 380 300 q 8 -6 16 0 t 16 0",
  "M 300 90 q 8 -6 16 0 t 16 0",
  "M 60 420 q 8 -6 16 0 t 16 0",
];

export default function IrelandMap({
  affordableCities,
  stretchCities,
  className,
}: Props) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Map of Ireland showing where you can afford to live"
    >
      <path d={IRELAND} fill="#F26B1F" />

      <text
        x="200"
        y="248"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="var(--font-inter)"
        fontWeight={600}
        fontSize={24}
        letterSpacing="1.2"
      >
        IRELAND
      </text>

      {WAVES.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#2E5FE8"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7] }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
        />
      ))}

      {CITIES.map((c, i) => {
        const comfortable = affordableCities.includes(c.name);
        const reach = stretchCities.includes(c.name);
        const fill = comfortable ? "#000000" : reach ? "#FFFFFF" : "rgba(0,0,0,0.28)";
        return (
          <motion.g
            key={c.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 240 }}
          >
            <circle
              cx={c.cx}
              cy={c.cy}
              r={6}
              fill={fill}
              stroke="#000000"
              strokeWidth={reach ? 2 : 0}
            />
            <text
              x={c.lx}
              y={c.ly}
              textAnchor={c.anchor}
              fill="#000000"
              fillOpacity={comfortable || reach ? 1 : 0.45}
              fontFamily="var(--font-inter)"
              fontWeight={500}
              fontSize={11}
              letterSpacing="0.05em"
            >
              {c.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
