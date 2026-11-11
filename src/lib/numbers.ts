/** Converts Persian (۰-۹) and Arabic-Indic (٠-٩) digits to Latin digits. */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const code = d.charCodeAt(0);
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
  });
}

/**
 * Reads a non-negative integer from free text ("۸٫۹۰۰", "890,000", "12 عدد").
 * Returns `fallback` only when no digits are found, so "0" stays 0.
 */
export function parseIntLoose(value: unknown, fallback = 0): number {
  const digits = toLatinDigits(String(value ?? "")).replace(/\D/g, "");
  if (!digits) return fallback;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : fallback;
}
