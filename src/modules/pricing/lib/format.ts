// Fare values are stored and transmitted as kobo (integer). Display only in Naira.

export function formatKobo(amountInKobo: number): string {
  const naira = amountInKobo / 100;
  return `₦${naira.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function nairaToKobo(amountInNaira: number): number {
  return Math.round(amountInNaira * 100);
}

export function koboToNaira(amountInKobo: number): number {
  return amountInKobo / 100;
}
