"use client";

/**
 * Monoline Georgian front door for the hero.
 * Thin white hairlines, no fills, with a warm radial glow bleeding
 * through the fanlight (F4C99A → F26B1F → transparent).
 */
export default function GeorgianDoor({ className }: { className?: string }) {
  const stroke = {
    stroke: "rgba(255,255,255,0.85)",
    strokeWidth: 1.1,
    fill: "none",
    vectorEffect: "non-scaling-stroke" as const,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  const faint = {
    ...stroke,
    stroke: "rgba(255,255,255,0.45)",
  };

  return (
    <svg
      viewBox="0 0 300 480"
      className={className}
      role="img"
      aria-label="Georgian front door"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="fanGlow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#F4C99A" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#F26B1F" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F26B1F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* warm glow through the fanlight / around the door */}
      <ellipse cx="150" cy="150" rx="170" ry="220" fill="url(#fanGlow)" />

      {/* Step base */}
      <path d={"M40 470 H260"} {...stroke} />
      <path d={"M55 470 V456 H245 V470"} {...faint} />

      {/* Outer casing: arch over a rectangle */}
      <path
        d={
          "M52 150 A98 98 0 0 1 248 150 " + // arch
          "L248 462 L52 462 Z"
        }
        {...stroke}
      />
      {/* inner casing reveal */}
      <path
        d={"M66 156 A84 84 0 0 1 234 156 L234 452 L66 452 Z"}
        {...faint}
      />

      {/* Fanlight (transom) */}
      <path d={"M84 168 A66 66 0 0 1 216 168 Z"} {...stroke} />
      {/* radiating glazing bars */}
      {[-60, -30, 0, 30, 60].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={150}
            y1={168}
            x2={150 + 62 * Math.cos(rad)}
            y2={168 + 62 * Math.sin(rad)}
            {...faint}
          />
        );
      })}
      <path d={"M84 168 H216"} {...stroke} />

      {/* Door leaf */}
      <rect x="88" y="176" width="124" height="276" {...stroke} />

      {/* Six recessed panels (2 cols × 3 rows) */}
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={100 + col * 54}
            y={190 + row * 84}
            width="44"
            height="70"
            {...faint}
          />
        ))
      )}

      {/* Brass knocker + knob */}
      <circle cx="150" cy="270" r="10" {...stroke} />
      <circle cx="150" cy="258" r="3" {...stroke} />
      <circle cx="196" cy="330" r="4" {...stroke} />

      {/* Sidelight hairlines flanking the casing */}
      <line x1="44" y1="200" x2="44" y2="462" {...faint} />
      <line x1="256" y1="200" x2="256" y2="462" {...faint} />
    </svg>
  );
}
