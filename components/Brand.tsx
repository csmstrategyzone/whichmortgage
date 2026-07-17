import LogoMark from "./LogoMark";

/** Back-compat wrapper — renders the WhichMortgage logo mark + wordmark. */
export default function Brand({
  tone = "dark",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return <LogoMark tone={tone} className={className} />;
}
