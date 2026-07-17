interface Props {
  tone?: "light" | "dark"; // wordmark colour context
  className?: string;
  hideWord?: boolean;
}

/** WhichMortgage logo: navy tile + orange house, "WhichMortgage" wordmark. */
export default function LogoMark({
  tone = "dark",
  className = "",
  hideWord = false,
}: Props) {
  const word = tone === "light" ? "text-white" : "text-navy";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-[5px] bg-navy">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          {/* house: roof + body */}
          <path
            d="M12 4 L20 11 L18 11 L18 19 L14 19 L14 14 L10 14 L10 19 L6 19 L6 11 L4 11 Z"
            fill="#F26B1F"
          />
        </svg>
      </span>
      {!hideWord && (
        <span className={`text-[15px] font-semibold tracking-tight ${word}`}>
          WhichMortgage
        </span>
      )}
    </div>
  );
}
