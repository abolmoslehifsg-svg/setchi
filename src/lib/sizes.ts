import { Size } from "@/types";
import { toLatinDigits } from "./numbers";

const range = (from: number, to: number): Size[] =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

export const LETTER_SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];
export const SHOE_SIZES: Size[] = range(39, 45);
export const WAIST_SIZES: Size[] = ["28", "30", "32", "34", "36", "38"];
export const FREE_SIZE: Size[] = ["FREE"];

export const SIZE_PRESETS: { label: string; sizes: Size[] }[] = [
  { label: "حروفی (S–XXL)", sizes: LETTER_SIZES },
  { label: "کفش (۳۹–۴۵)", sizes: SHOE_SIZES },
  { label: "کمر شلوار (۲۸–۳۸)", sizes: WAIST_SIZES },
  { label: "فری‌سایز", sizes: FREE_SIZE },
];

const MAX_SIZES = 30;
const MAX_SIZE_LENGTH = 12;
const MAX_RANGE_SPAN = 30;
const NUMERIC_RANGE = /^(\d{1,3})-(\d{1,3})$/;

export function parseSizes(input: string): Size[] {
  const tokens = toLatinDigits(input)
    .replace(/(\d)\s*[-–—~]\s*(\d)/g, "$1-$2")
    .split(/[\s,،;؛|]+/)
    .filter(Boolean);

  const out: Size[] = [];
  const push = (raw: string) => {
    const size = raw.toUpperCase().slice(0, MAX_SIZE_LENGTH);
    if (!out.includes(size)) out.push(size);
  };

  for (const token of tokens) {
    const m = NUMERIC_RANGE.exec(token);
    if (m) {
      const a = Number(m[1]);
      const b = Number(m[2]);
      const [from, to] = a <= b ? [a, b] : [b, a];
      if (to - from <= MAX_RANGE_SPAN) {
        for (let n = from; n <= to; n++) push(String(n));
        continue;
      }
    }
    push(token);
  }
  return out.slice(0, MAX_SIZES);
}

export const formatSizes = (sizes: readonly Size[]): string => sizes.join(", ");
