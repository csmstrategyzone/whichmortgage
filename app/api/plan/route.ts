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

const SYSTEM_PROMPT =
  "You are an Irish mortgage coach for WhichMortgage. Write two warm, direct " +
  "paragraphs. Paragraph 1: summarise what they can afford in plain terms and " +
  "name which Irish schemes they qualify for (Help to Buy, First Home Scheme, " +
  "Fresh Start). Paragraph 2: three specific actionable steps for the next 30 " +
  "days. Only reference Irish rules and providers. Warm broker tone, no fluff, " +
  "no disclaimers.";

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
    return streamText(fallbackPlan(data));
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
        stream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });
        await stream.finalMessage();
        controller.close();
      } catch {
        // Fall back to a templated plan on any API error
        controller.enqueue(encoder.encode(fallbackPlan(data)));
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
  const schemes = [
    d.htbAmount > 0 && "Help to Buy",
    d.firstTimeBuyer && "the First Home Scheme",
    "Fresh Start",
  ].filter(Boolean);

  return (
    `With ${euro(d.buyingPower)} of buying power, a home around ${euro(
      d.propertyPrice
    )} is well within reach — your ${euro(
      d.deposit
    )} deposit and four times your income do the heavy lifting` +
    (d.htbAmount > 0
      ? `, and your ${euro(d.htbAmount)} Help to Buy refund tops it off`
      : "") +
    `. As a first-time buyer you can look at ${schemes.join(
      ", "
    )} to stretch further.\n\n` +
    `Over the next 30 days: 1) Gather six months of payslips and bank statements so a broker can confirm your figures. 2) Get Approval in Principle from two Irish lenders to lock in your borrowing power. 3) ` +
    (d.newBuild && d.firstTimeBuyer
      ? `Register for Help to Buy on Revenue.ie so your €30,000 is ready when you sign.`
      : `Start viewing homes in your budget and line up a solicitor for when you bid.`)
  );
}
