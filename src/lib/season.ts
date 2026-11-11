/** تشخیص فصل بر اساس ماه میلادی (تقریبی برای ایران) */
export type Season = "spring" | "summer" | "fall" | "winter";

export function getCurrentSeason(date = new Date()): Season {
  const m = date.getMonth() + 1; // 1–12
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
}

export const SEASON_LABEL_FA: Record<Season, string> = {
  spring: "بهار",
  summer: "تابستان",
  fall: "پاییز",
  winter: "زمستان",
};
