/** Splits "Black, Olive، سفید" (or one per line) into a clean, de-duplicated list. */
export function parseList(input: string): string[] {
  const out: string[] = [];
  for (const raw of input.split(/[,،;؛\n]+/)) {
    const item = raw.trim();
    if (item && !out.includes(item)) out.push(item);
  }
  return out;
}
