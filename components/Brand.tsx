interface Props {
  tone?: "light" | "dark"; // text colour context
  className?: string;
}

/** "WhichMortgage" wordmark — Fraunces, per the locked design. */
export default function Brand({ tone = "dark", className = "" }: Props) {
  const color = tone === "light" ? "text-white" : "text-navy";
  return (
    <span
      className={`font-serif text-[18px] font-normal tracking-tight ${color} ${className}`}
    >
      Which<span className="text-orange">Mortgage</span>
    </span>
  );
}
