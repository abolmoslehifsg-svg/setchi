import {
  WardrobeItem, WardrobeOutfit, WardrobePrefs,
  UPPER_CATEGORIES, LOWER_CATEGORIES, SHOE_CATEGORIES, OUTER_CATEGORIES, CATEGORY_LABELS,
} from "./types";
import { uid } from "./storage";

const NEUTRAL = new Set(["black", "white", "gray", "beige", "navy", "brown"]);

function colorsCompatible(a: string, b: string): boolean {
  if (a === b || NEUTRAL.has(a) || NEUTRAL.has(b)) return true;
  const pairs: Record<string, string[]> = {
    navy: ["white", "beige", "gray", "blue"],
    olive: ["beige", "brown", "black", "white"],
    blue: ["white", "navy", "gray", "beige"],
    green: ["beige", "brown", "black", "white"],
  };
  return (pairs[a] || []).includes(b) || (pairs[b] || []).includes(a);
}

function scorePair(a: WardrobeItem, b: WardrobeItem, prefs: WardrobePrefs): number {
  let s = 40;
  if (colorsCompatible(a.mainColor, b.mainColor)) s += 25; else s -= 15;
  if (prefs.dislikedColors.includes(a.mainColor) || prefs.dislikedColors.includes(b.mainColor)) s -= 30;
  if (prefs.preferredColors.includes(a.mainColor) || prefs.preferredColors.includes(b.mainColor)) s += 12;
  if (prefs.style && (a.style === prefs.style || b.style === prefs.style)) s += 15;
  if (prefs.fit && (a.fit === prefs.fit || b.fit === prefs.fit)) s += 8;
  if (prefs.season && prefs.season !== "all") {
    if (a.season === "all" || a.season === prefs.season) s += 6;
    if (b.season === "all" || b.season === prefs.season) s += 6;
  }
  if (a.style === b.style) s += 10;
  return s;
}

export interface GeneratedOutfit {
  items: WardrobeItem[];
  score: number;
  explanationFa: string;
}

export function generateFromWardrobe(
  wardrobe: WardrobeItem[],
  prefs: WardrobePrefs,
  limit = 6
): GeneratedOutfit[] {
  const uppers = wardrobe.filter((i) => UPPER_CATEGORIES.includes(i.category));
  const lowers = wardrobe.filter((i) => LOWER_CATEGORIES.includes(i.category));
  const shoes = wardrobe.filter((i) => SHOE_CATEGORIES.includes(i.category));
  const outers = wardrobe.filter((i) => OUTER_CATEGORIES.includes(i.category));
  if (!uppers.length || !lowers.length) return [];

  const results: GeneratedOutfit[] = [];
  for (const top of uppers) {
    for (const bottom of lowers) {
      let score = scorePair(top, bottom, prefs);
      const items: WardrobeItem[] = [top, bottom];
      const reasons: string[] = [];
      reasons.push(
        colorsCompatible(top.mainColor, bottom.mainColor)
          ? "هماهنگی رنگ بالا و پایین"
          : "کنتراست رنگی کنترل‌شده"
      );
      let bestShoe: WardrobeItem | null = null;
      let bestShoeScore = -999;
      for (const sh of shoes) {
        const sc =
          (colorsCompatible(sh.mainColor, top.mainColor) ? 20 : 0) +
          (colorsCompatible(sh.mainColor, bottom.mainColor) ? 15 : 0) +
          (NEUTRAL.has(sh.mainColor) ? 10 : 0);
        if (sc > bestShoeScore) { bestShoeScore = sc; bestShoe = sh; }
      }
      if (bestShoe) {
        items.push(bestShoe);
        score += Math.max(0, bestShoeScore);
        reasons.push("کفش هماهنگ با پالت");
      }
      if (outers.length && (prefs.season === "fall" || prefs.season === "winter" || !prefs.season)) {
        const jacket = outers.find(
          (j) => colorsCompatible(j.mainColor, top.mainColor) || NEUTRAL.has(j.mainColor)
        );
        if (jacket) { items.push(jacket); score += 12; reasons.push("لایه رویه برای عمق استایل"); }
      }
      if (prefs.style) {
        const hits = items.filter((i) => i.style === prefs.style).length;
        score += hits * 8;
      }
      if (prefs.occasion === "formal" && (top.category === "hoodie" || bottom.category === "shorts")) score -= 25;
      if (prefs.occasion === "sports" && (top.category === "hoodie" || bottom.category === "shorts")) score += 15;
      score = Math.max(0, Math.min(100, Math.round(score)));
      results.push({
        items,
        score,
        explanationFa: `این ترکیب از لباس‌های خودت ساخته شده. ${reasons.slice(0, 3).join("؛ ")}.`,
      });
    }
  }
  results.sort((a, b) => b.score - a.score);
  const picked: GeneratedOutfit[] = [];
  const usedTops = new Set<string>();
  for (const r of results) {
    if (picked.length >= limit) break;
    const topId = r.items[0]?.id;
    if (topId && usedTops.has(topId) && picked.length >= 2) continue;
    if (topId) usedTops.add(topId);
    picked.push(r);
  }
  return picked;
}

export function toSavedOutfit(g: GeneratedOutfit, occasion?: WardrobePrefs["occasion"]): WardrobeOutfit {
  return {
    id: uid(),
    name: g.items.map((i) => i.name || CATEGORY_LABELS[i.category]).join(" + "),
    itemIds: g.items.map((i) => i.id),
    occasion,
    score: g.score,
    explanationFa: g.explanationFa,
    savedAt: Date.now(),
  };
}

export function replaceItemInOutfit(
  outfitItems: WardrobeItem[],
  roleIndex: number,
  wardrobe: WardrobeItem[],
  prefs: WardrobePrefs
): WardrobeItem[] | null {
  const current = outfitItems[roleIndex];
  if (!current) return null;
  const pool = wardrobe.filter((i) => i.category === current.category && i.id !== current.id);
  if (!pool.length) return null;
  let best = pool[0];
  let bestScore = -999;
  for (const candidate of pool) {
    let s = 0;
    for (let i = 0; i < outfitItems.length; i++) {
      if (i === roleIndex) continue;
      s += scorePair(candidate, outfitItems[i], prefs);
    }
    if (s > bestScore) { bestScore = s; best = candidate; }
  }
  const next = [...outfitItems];
  next[roleIndex] = best;
  return next;
}

export function analyzeMissing(wardrobe: WardrobeItem[]) {
  const tips: { titleFa: string; reasonFa: string; suggestedCategory: string; storeHint?: string }[] = [];
  const count = (cats: string[]) => wardrobe.filter((i) => cats.includes(i.category)).length;
  const uppers = count(["tshirt", "shirt", "hoodie", "sweater"]);
  const lowers = count(["pants", "jeans", "shorts"]);
  const shoes = count(["shoes"]);
  const jackets = count(["jacket"]);
  if (wardrobe.length === 0) {
    return [{ titleFa: "اولین لباس را اضافه کن", reasonFa: "با ۳–۵ لباس پایه موتور استایل شروع می‌کند.", suggestedCategory: "tshirt" }];
  }
  if (uppers === 0) tips.push({ titleFa: "بالاتنه کم داری", reasonFa: "بدون تی‌شرت یا هودی ست کامل نمی‌شود.", suggestedCategory: "tshirt", storeHint: "oversized-tshirt" });
  if (lowers === 0) tips.push({ titleFa: "پایین‌تنه کم داری", reasonFa: "یک شلوار خنثی ترکیب‌ها را چند برابر می‌کند.", suggestedCategory: "pants", storeHint: "cargo-pants" });
  if (shoes === 0) tips.push({ titleFa: "کفش ثبت نشده", reasonFa: "کفش خنثی تقریباً با همه ست‌ها جور است.", suggestedCategory: "shoes", storeHint: "sneakers" });
  if (jackets === 0 && wardrobe.length >= 3) tips.push({ titleFa: "یک رویه اضافه کن", reasonFa: "کاپشن استایل را کامل‌تر می‌کند.", suggestedCategory: "jacket", storeHint: "jacket" });
  const neutrals = wardrobe.filter((i) => NEUTRAL.has(i.mainColor)).length;
  if (wardrobe.length >= 4 && neutrals < 2) tips.push({ titleFa: "رنگ خنثی کم است", reasonFa: "مشکی، سفید یا بژ ست کردن را آسان‌تر می‌کند.", suggestedCategory: "tshirt" });
  if (uppers >= 3 && lowers >= 2 && shoes >= 1 && tips.length === 0) {
    tips.push({ titleFa: "کمدت برای شروع خوبه", reasonFa: "از ساخت استایل استفاده کن و کم‌کم تنوع را بیشتر کن.", suggestedCategory: "accessories" });
  }
  return tips.slice(0, 4);
}
