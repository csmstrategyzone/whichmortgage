// WhichMortgage affordability model (Irish rules, simplified for the demo).

export interface Answers {
  income: number; // annual gross, €
  coApplicantIncome: number; // annual gross, € (optional → 0)
  savings: number; // deposit saved, €
  propertyPrice: number; // target purchase price, €
  newBuild: boolean;
  firstTimeBuyer: boolean;
}

export interface Result {
  borrowing: number; // 4× combined income
  depositNeeded: number; // 10% of price
  deposit: number; // what they've actually saved
  htb: number; // Help to Buy grant
  htbEligible: boolean;
  buyingPower: number; // total they can bring to the table
  combinedIncome: number;
}

export const HTB_MAX = 30000;

export function computeResult(a: Answers): Result {
  const combinedIncome = (a.income || 0) + (a.coApplicantIncome || 0);
  const borrowing = 4 * combinedIncome;
  const depositNeeded = (a.propertyPrice || 0) * 0.1;
  const htbEligible = Boolean(a.newBuild && a.firstTimeBuyer);
  const htb = htbEligible ? Math.min(HTB_MAX, (a.propertyPrice || 0) * 0.1) : 0;
  const deposit = a.savings || 0;
  const buyingPower = borrowing + deposit + htb;

  return {
    borrowing,
    depositNeeded,
    deposit,
    htb,
    htbEligible,
    buyingPower,
    combinedIncome,
  };
}

// Median property prices for the five mapped cities (€).
export const CITY_PRICES: Record<string, number> = {
  Dublin: 450000,
  Galway: 310000,
  Limerick: 260000,
  Cork: 320000,
  Waterford: 240000,
};

/** Cities you can buy in comfortably (buying power covers the median). */
export function affordableCities(buyingPower: number): string[] {
  return Object.entries(CITY_PRICES)
    .filter(([, price]) => buyingPower >= price)
    .map(([c]) => c);
}

/** Cities within ~10% reach — a stretch, but not out of the question. */
export function stretchCities(buyingPower: number): string[] {
  return Object.entries(CITY_PRICES)
    .filter(([, price]) => buyingPower >= price * 0.9 && buyingPower < price)
    .map(([c]) => c);
}

export function euro(n: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));
}

/** Grouped integer, no symbol — for split "€" + number layouts. */
export function num(n: number): string {
  return Math.round(n || 0).toLocaleString("en-IE");
}
