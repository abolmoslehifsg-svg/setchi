"use client";

import type { FitPreference, Occasion, Outfit } from "@/types";
import type { Season } from "@/lib/season";
import { SEASON_LABEL_FA } from "@/lib/season";

export const OCCASION_LABEL_FA: Record<Occasion, string> = {
  daily: "روزمره",
  university: "دانشگاه",
  party: "مهمانی",
  "casual-outings": "گردش",
  work: "کار",
  sport: "ورزش",
};

export const FIT_LABEL_FA: Record<FitPreference, string> = {
  oversized: "اورسایز / آزاد",
  regular: "معمولی",
  slim: "جذب",
};

export const ROLE_LABEL_FA: Record<string, string> = {
  top: "بالا",
  bottom: "پایین",
  footwear: "کفش",
  outer: "رویه / کاپشن",
  accessory: "اکسسوری",
};

/** تخمین فصل مناسب از رنگ/استایل/تگ — برای فیلتر بدون فیلد فصل در دیتا */
export function getOutfitSeasons(o: Outfit): Season[] {
  const blob = [
    ...o.tags,
    ...o.colors,
    ...o.style,
    o.title,
    o.titleFa,
    o.descriptionFa,
  ]
    .join(" ")
    .toLowerCase();

  const hits: Season[] = [];
  if (/winter|زمستان|hoodie|layer|پالتو|بوت|wool|کاپشن/.test(blob)) hits.push("winter");
  if (/fall|autumn|پاییز|olive|beige|cargo|layered|khaki/.test(blob)) hits.push("fall");
  if (/summer|تابستان|sport|white|linen|نخی/.test(blob)) hits.push("summer");
  if (/spring|بهار|light|minimal|beige|white/.test(blob)) hits.push("spring");

  // پیش‌فرض همه‌فصل اگر چیزی نخورد
  if (hits.length === 0) return ["spring", "summer", "fall", "winter"];
  return Array.from(new Set(hits));
}

export function seasonLabel(s: Season) {
  return SEASON_LABEL_FA[s];
}

export function outfitBudgetBand(price: number): "budget" | "mid" | "premium" {
  if (price < 5_000_000) return "budget";
  if (price < 8_000_000) return "mid";
  return "premium";
}

export const BUDGET_LABEL_FA = {
  budget: "اقتصادی",
  mid: "متوسط",
  premium: "پریمیوم",
} as const;
