import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PlanRequest {
  income: number;
  coApplicantIncome: number;
  deposit: number;
  propertyPrice: number;
  newBuild: boolean;
  firstTimeBuyer: boolean;
  buyingPower: number;
  htbAmount: number;
}

const SYSTEM_PROMPT = `You are an expert Irish mortgage coach writing on behalf of WhichMortgage, an Irish mortgage brokerage regulated by the Central Bank of Ireland. Your job is to write a warm, direct 2-paragraph personalised plan for a first-time buyer.

CRITICAL RULES — NEVER BREAK THESE:
1. NEVER tell the user to contact banks or lenders directly by name (AIB, Bank of Ireland, Permanent TSB, PTSB, Haven, Avant Money, Finance Ireland, ICS, etc). WhichMortgage compares the whole market on the user's behalf — that's the entire value.
2. When you would otherwise say 'contact X bank' or 'go to Y lender', instead say 'WhichMortgage will approach [description of lender type] on your behalf' — e.g. 'WhichMortgage will compare the best first-time buyer rates across the market for you' or 'your WhichMortgage broker will handle the Approval in Principle applications with multiple lenders in parallel'.
3. Every action step should either be something the USER does themselves (documents, savings, credit report, gift letters) OR something WHICHMORTGAGE does for them (comparing rates, submitting applications, negotiating). Never direct-to-lender.
4. Reference Irish schemes correctly: Help to Buy (new-builds only, up to €30k), First Home Scheme (new-builds only, up to 30% government equity), Fresh Start (for previous homeowners who've lost a home to bankruptcy/insolvency). Only mention schemes the user actually qualifies for.
5. Tone: warm, direct, no fluff, no disclaimers, no 'please consult a financial advisor' hedging. WhichMortgage IS the advisor.
6. Output PLAIN TEXT ONLY. Never use markdown syntax. That means:
   - NO ## or ### headers — write section titles as plain lines
   - NO **bold** — write emphasis in plain prose
   - NO *italics*, backticks, or other markdown
   - NO em-dashes wrapped in bold — just use commas or plain em-dashes
   - For section headings, just write the heading on its own line in plain text (like 'Your Mortgage Picture' or 'Your Next 30 Days')
   - For the numbered action list, just use '1. ', '2. ', '3. ' followed by plain text — no bold on the first phrase

STRUCTURE:
Paragraph 1 (Your Mortgage Picture): 3-4 sentences summarising what they can afford, which schemes apply (or don't), and where the gap is between their buying power and their target.

Paragraph 2 (Your Next 30 Days): A numbered list of 4-5 concrete actions for the next 30 days. Each action is either something the user does OR something WhichMortgage does on their behalf. Never 'contact bank X directly'.`;

/**
 * Safety net for rule 6 — strip markdown even if the model slips. The plan is
 * rendered as raw pre-wrapped text, so any syntax that survives reaches the
 * user as literal ** and ## characters.
 *
 * `atLineStart` says whether `text` begins at a real line start; when it starts
 * mid-line, a leading '#' is prose, not a heading.
 */
function stripMarkdown(text: string, atLineStart = true): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(atLineStart ? /^#{1,6}\s+/gm : /(?<=\n)#{1,6}\s+/g, "");
}

/**
 * How much of `buf` can be sanitised and flushed right now.
 *
 * Markdown delimiters here are paired and never span a line, but a stream chunk
 * can land mid-token ('**bo' + 'ld**') — stripping each delta on its own would
 * miss those entirely. Everything from the first still-open delimiter is held
 * back until its closer arrives.
 */
function flushableLength(buf: string): number {
  const lineStart = buf.lastIndexOf("\n") + 1;
  const line = buf.slice(lineStart);

  // A heading marker whose text hasn't arrived yet.
  if (/^#{1,6}\s*$/.test(line)) return lineStart;

  let cut = buf.length;
  for (const runs of [[...line.matchAll(/\*+/g)], [...line.matchAll(/`+/g)]]) {
    if (!runs.length) continue;
    const last = runs[runs.length - 1];
    const touchesEnd = last.index + last[0].length === line.length;

    let hold = -1;
    if (runs.length % 2 === 1) {
      // Unmatched opener — hold from it until its closer arrives.
      hold = last.index;
    } else if (touchesEnd && runs.length >= 2) {
      // Closer sitting at the buffer edge may still be growing ('*' -> '**'),
      // so hold from its opener — flushing the opener alone would leak syntax.
      hold = runs[runs.length - 2].index;
    }
    if (hold >= 0) cut = Math.min(cut, lineStart + hold);
  }
  return cut;
}

const euro = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));

export async function POST(request: Request) {
  const data = (await request.json()) as PlanRequest;

  const userMessage = [
    `Annual income: ${euro(data.income)}`,
    `Co-applicant income: ${euro(data.coApplicantIncome)}`,
    `Deposit saved: ${euro(data.deposit)}`,
    `Target property price: ${euro(data.propertyPrice)}`,
    `New-build: ${data.newBuild ? "Yes" : "No"}`,
    `First-time buyer: ${data.firstTimeBuyer ? "Yes" : "No"}`,
    `Total buying power: ${euro(data.buyingPower)}`,
    `Help to Buy amount: ${euro(data.htbAmount)}`,
  ].join("\n");

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Graceful fallback so the demo works before a key is pasted in .env.local
  if (!apiKey) {
    return streamText(stripMarkdown(fallbackPlan(data)));
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        });
        let buf = "";
        let atLineStart = true;
        stream.on("text", (delta) => {
          buf += delta;
          const n = flushableLength(buf);
          if (n === 0) return;
          const raw = buf.slice(0, n);
          buf = buf.slice(n);
          const out = stripMarkdown(raw, atLineStart);
          atLineStart = raw.endsWith("\n");
          if (out) controller.enqueue(encoder.encode(out));
        });
        await stream.finalMessage();
        if (buf) {
          controller.enqueue(encoder.encode(stripMarkdown(buf, atLineStart)));
        }
        controller.close();
      } catch {
        // Fall back to a templated plan on any API error
        controller.enqueue(encoder.encode(stripMarkdown(fallbackPlan(data))));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function streamText(text: string) {
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function fallbackPlan(d: PlanRequest): string {
  // Scheme eligibility — both Help to Buy and the First Home Scheme are
  // new-build only; Fresh Start is for previous owners, not first-time buyers.
  const htbEligible = d.newBuild && d.firstTimeBuyer && d.htbAmount > 0;
  const fhsEligible = d.newBuild && d.firstTimeBuyer;
  // Fresh Start turns on circumstances we don't collect (bankruptcy, insolvency,
  // separation), so we never assert it — the broker confirms it instead.
  const freshStartPossible = !d.firstTimeBuyer;

  const schemes = [
    htbEligible && "Help to Buy",
    fhsEligible && "the First Home Scheme",
  ].filter(Boolean) as string[];

  const gap = (d.propertyPrice || 0) - (d.buyingPower || 0);

  const picture =
    `With ${euro(d.buyingPower)} of buying power, your ${euro(
      d.deposit
    )} deposit and four times your income do the heavy lifting` +
    (htbEligible
      ? `, and your ${euro(d.htbAmount)} Help to Buy refund tops it off`
      : "") +
    `. ` +
    (gap > 0
      ? `A home around ${euro(d.propertyPrice)} leaves a gap of ${euro(
          gap
        )} to close, so the plan below is about closing it. `
      : `A home around ${euro(
          d.propertyPrice
        )} is well within reach. `) +
    (schemes.length
      ? `You qualify for ${schemes.join(" and ")}, which stretches you further.`
      : freshStartPossible
        ? `Help to Buy and the First Home Scheme are new-build only, so they don't apply here — and if you previously lost a home through insolvency or separation, your broker will confirm whether Fresh Start puts you back on first-time buyer terms.`
        : `The government schemes are new-build only, so they don't apply here — the numbers below stand on their own.`);

  const steps = [
    `Gather six months of payslips and bank statements so we can confirm your figures.`,
    `Pull your free Central Credit Register report and flag anything unexpected to us.`,
    d.firstTimeBuyer
      ? `Your WhichMortgage broker will compare the best first-time buyer rates across the whole market for you.`
      : `Your WhichMortgage broker will compare the best rates across the whole market for you.`,
    `We'll submit your Approval in Principle applications to multiple lenders in parallel and negotiate on your behalf.`,
    htbEligible
      ? `Register for Help to Buy on Revenue.ie so your ${euro(
          d.htbAmount
        )} is ready when you sign.`
      : `Line up a solicitor now so you can move fast when you bid.`,
  ];

  return (
    `Your Mortgage Picture\n\n${picture}\n\n` +
    `Your Next 30 Days\n\n` +
    steps.map((s, i) => `${i + 1}. ${s}`).join("\n")
  );
}
