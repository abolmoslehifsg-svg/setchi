import {
  WardrobeItem, WardrobeOutfit, WardrobePrefs, WardrobeCategory,
  UPPER_CATEGORIES, LOWER_CATEGORIES, SHOE_CATEGORIES, OUTER_CATEGORIES, CATEGORY_LABELS,
} from "./types";
import { uid } from "./storage";

const NEUTRAL = new Set(["black", "white", "gray", "beige", "navy", "brown"]);
const COLOR_LABEL: Record<string, string> = {
  black: "مشکی", white: "سفید", gray: "خاکستری", beige: "بژ", navy: "سرمه‌ای",
  blue: "آبی", olive: "زیتونی", brown: "قهوه‌ای", green: "سبز", red: "قرمز",
};
const OCC_F: Record<string, number> = {
  formal: 3, work: 2, date: 2, party: 1, school: 1, everyday: 0, sports: 0,
};
const CAT_F: Record<WardrobeCategory, number> = {
  shirt: 2, jacket: 2, pants: 1, jeans: 1, sweater: 1, tshirt: 0, hoodie: 0, shorts: 0, shoes: 1, accessories: 1,
};

function colorsOk(a: string, b: string): boolean {
  if (a === b || NEUTRAL.has(a) || NEUTRAL.has(b)) return true;
  const pairs: Record<string, string[]> = {
    navy: ["white", "beige", "gray", "blue"], olive: ["beige", "brown", "black", "white"],
    blue: ["white", "navy", "gray", "beige"], green: ["beige", "brown", "black", "white"],
    red: ["black", "white", "navy", "gray"],
  };
  return (pairs[a] || []).includes(b) || (pairs[b] || []).includes(a);
}

export interface GeneratedOutfit {
  items: WardrobeItem[];
  score: number;
  explanationFa: string;
}

/** Full rescoring from scratch — never increment score artificially */
export function scoreOutfitItems(items: WardrobeItem[], prefs: WardrobePrefs) {
  if (items.length < 2) return { score: 0, explanationFa: "حداقل دو قطعه لازم است.", reasons: [] as string[] };
  let hits = 0, pairs = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs++;
      if (colorsOk(items[i].mainColor, items[j].mainColor)) hits++;
      for (const sc of items[i].secondaryColors || []) {
        if (colorsOk(sc, items[j].mainColor)) hits += 0.5;
      }
    }
  }
  const ratio = pairs ? hits / pairs : 0;
  let colorScore = ratio >= 0.75 ? 28 : ratio >= 0.4 ? 16 : 4;
  const colorNote = ratio >= 0.75 ? "پالت رنگ هماهنگ و یکدست است" : ratio >= 0.4 ? "کنتراست رنگی کنترل‌شده" : "رنگ‌ها کمتر با هم جورند";

  const styles = items.map((i) => i.style);
  const sameStyle = styles.every((x) => x === styles[0]);
  let styleScore = sameStyle ? 14 : 6;
  if (prefs.style) styleScore += items.filter((i) => i.style === prefs.style).length * 6;
  if (prefs.fit) styleScore += items.filter((i) => i.fit === prefs.fit).length * 4;

  let seasonScore = 6;
  let seasonNote = "";
  if (prefs.season && prefs.season !== "all") {
    const ok = items.filter((i) => i.season === "all" || i.season === prefs.season).length / items.length;
    seasonScore = ok >= 0.8 ? 14 : ok >= 0.5 ? 7 : 0;
    seasonNote = ok >= 0.8 ? "مناسب فصل انتخاب‌شده" : ok >= 0.5 ? "بخشی از قطعات با فصل جورند" : "ناسازگاری با فصل";
  }

  let occScore = 8;
  let occNote = "";
  if (prefs.occasion) {
    const target = OCC_F[prefs.occasion] ?? 1;
    const avg = items.reduce((s, i) => s + (CAT_F[i.category] ?? 1), 0) / items.length;
    const gap = Math.abs(avg - target);
    if (prefs.occasion === "formal" && items.some((i) => i.category === "hoodie" || i.category === "shorts")) {
      occScore = 0; occNote = "هودی/شلوارک برای موقعیت رسمی‌تر مناسب نیست";
    } else if (prefs.occasion === "sports") {
      const good = items.some((i) => i.category === "hoodie" || i.category === "shorts" || i.style === "sporty");
      occScore = good ? 16 : 6; occNote = good ? "مناسب فعالیت و حس اسپرتی" : "کمی رسمی‌تر از موقعیت ورزشی";
    } else {
      occScore = gap <= 0.6 ? 16 : gap <= 1.2 ? 8 : 2;
      occNote = gap <= 0.6 ? "هم‌خوان با موقعیت" : "فاصله با سطح رسمی موقعیت";
    }
  }

  let prefC = 0;
  for (const i of items) {
    if (prefs.dislikedColors.includes(i.mainColor)) prefC -= 18;
    if (prefs.preferredColors.includes(i.mainColor)) prefC += 8;
  }
  const loud = items.filter((i) => i.pattern && i.pattern !== "solid").length;
  const pat = loud >= 3 ? -8 : loud === 2 ? -2 : 4;

  let raw = 20 + colorScore + styleScore + seasonScore + occScore + pat + prefC;
  const hasUpper = items.some((i) => UPPER_CATEGORIES.includes(i.category));
  const hasLower = items.some((i) => LOWER_CATEGORIES.includes(i.category));
  const hasShoe = items.some((i) => SHOE_CATEGORIES.includes(i.category));
  if (hasUpper && hasLower) raw += 8;
  if (hasShoe) raw += 6;
  if (items.some((i) => OUTER_CATEGORIES.includes(i.category))) raw += 4;

  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const reasons = [colorNote, sameStyle ? "سبک لباس‌ها یکدست است" : "سبک‌ها ترکیب شده‌اند", seasonNote, occNote].filter(Boolean);
  const top = items.find((i) => UPPER_CATEGORIES.includes(i.category));
  if (top) reasons.push(`نقش اصلی: ${top.name || CATEGORY_LABELS[top.category]} (${COLOR_LABEL[top.mainColor] || top.mainColor})`);
  if (!hasShoe) reasons.push("بدون کفش؛ کفش خنثی ترکیب را کامل‌تر می‌کند");

  return { score, explanationFa: reasons.slice(0, 4).join(" · "), reasons };
}

function bestShoe(shoes: WardrobeItem[], top: WardrobeItem, bottom: WardrobeItem) {
  let best: WardrobeItem | null = null, bestSc = -999;
  for (const sh of shoes) {
    let sc = 0;
    if (colorsOk(sh.mainColor, top.mainColor)) sc += 22;
    if (colorsOk(sh.mainColor, bottom.mainColor)) sc += 18;
    if (NEUTRAL.has(sh.mainColor)) sc += 12;
    if (sh.style === top.style || sh.style === bottom.style) sc += 8;
    if (sc > bestSc) { bestSc = sc; best = sh; }
  }
  return best;
}

function bestOuter(outers: WardrobeItem[], top: WardrobeItem, prefs: WardrobePrefs) {
  if (!outers.length) return null;
  if (prefs.season === "summer") return null;
  let best: WardrobeItem | null = null, bestSc = -999;
  for (const j of outers) {
    let sc = 0;
    if (colorsOk(j.mainColor, top.mainColor) || NEUTRAL.has(j.mainColor)) sc += 20;
    if (prefs.style && j.style === prefs.style) sc += 10;
    if (prefs.season && (j.season === prefs.season || j.season === "all")) sc += 8;
    if (sc > bestSc) { bestSc = sc; best = j; }
  }
  return bestSc >= 12 ? best : null;
}

export function generateFromWardrobe(wardrobe: WardrobeItem[], prefs: WardrobePrefs, limit = 6): GeneratedOutfit[] {
  const uppers = wardrobe.filter((i) => UPPER_CATEGORIES.includes(i.category));
  const lowers = wardrobe.filter((i) => LOWER_CATEGORIES.includes(i.category));
  const shoes = wardrobe.filter((i) => SHOE_CATEGORIES.includes(i.category));
  const outers = wardrobe.filter((i) => OUTER_CATEGORIES.includes(i.category));
  if (!uppers.length || !lowers.length) return [];

  const results: GeneratedOutfit[] = [];
  for (const top of uppers) {
    for (const bottom of lowers) {
      const items: WardrobeItem[] = [top, bottom];
      const sh = bestShoe(shoes, top, bottom);
      if (sh) items.push(sh);
      const out = bestOuter(outers, top, prefs);
      if (out) items.push(out);
      const scored = scoreOutfitItems(items, prefs);
      results.push({ items, score: scored.score, explanationFa: scored.explanationFa });
    }
  }
  results.sort((a, b) => b.score - a.score);
  const picked: GeneratedOutfit[] = [];
  const usedTops = new Set<string>();
  const usedKeys = new Set<string>();
  for (const r of results) {
    if (picked.length >= limit) break;
    const topId = r.items.find((i) => UPPER_CATEGORIES.includes(i.category))?.id || "";
    const botId = r.items.find((i) => LOWER_CATEGORIES.includes(i.category))?.id || "";
    const key = `${topId}|${botId}`;
    if (usedKeys.has(key)) continue;
    if (usedTops.has(topId) && picked.length >= Math.ceil(limit / 2)) continue;
    usedKeys.add(key);
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
    occasion, score: g.score, explanationFa: g.explanationFa, savedAt: Date.now(),
  };
}

export function replaceItemInOutfit(
  outfitItems: WardrobeItem[], roleIndex: number, wardrobe: WardrobeItem[], prefs: WardrobePrefs
): WardrobeItem[] | null {
  const current = outfitItems[roleIndex];
  if (!current) return null;
  const pool = wardrobe.filter((i) => i.category === current.category && i.id !== current.id);
  if (!pool.length) return null;
  let best = pool[0], bestScore = -1;
  for (const candidate of pool) {
    const next = [...outfitItems];
    next[roleIndex] = candidate;
    const { score } = scoreOutfitItems(next, prefs);
    if (score > bestScore) { bestScore = score; best = candidate; }
  }
  const next = [...outfitItems];
  next[roleIndex] = best;
  return next;
}

export function analyzeMissing(wardrobe: WardrobeItem[]) {
  const tips: { titleFa: string; reasonFa: string; suggestedCategory: string; storeHint?: string; priority: number }[] = [];
  const count = (cats: string[]) => wardrobe.filter((i) => cats.includes(i.category)).length;
  const uppers = count(["tshirt", "shirt", "hoodie", "sweater"]);
  const lowers = count(["pants", "jeans", "shorts"]);
  const shoes = count(["shoes"]);
  const jackets = count(["jacket"]);
  const neutrals = wardrobe.filter((i) => NEUTRAL.has(i.mainColor)).length;

  if (wardrobe.length === 0) {
    return [{ titleFa: "اولین لباس را اضافه کن", reasonFa: "با ثبت چند قطعه پایه موتور پیشنهاد شروع به کار می‌کند.", suggestedCategory: "tshirt" }];
  }
  if (uppers === 0) tips.push({ titleFa: "بالاتنه ثبت نشده", reasonFa: "بدون تی‌شرت/پیراهن/هودی ست کامل ساخته نمی‌شود.", suggestedCategory: "tshirt", storeHint: "oversized-tshirt", priority: 95 });
  if (lowers === 0) tips.push({ titleFa: "پایین‌تنه ثبت نشده", reasonFa: "یک شلوار خنثی تعداد ترکیب‌ها را چند برابر می‌کند.", suggestedCategory: "pants", storeHint: "cargo-pants", priority: 95 });
  if (shoes === 0 && uppers > 0 && lowers > 0) {
    tips.push({ titleFa: "کفش نداری", reasonFa: `با ${uppers} بالاتنه و ${lowers} پایین‌تنه می‌توانی ست بسازی؛ کفش خنثی ترکیب را کامل می‌کند.`, suggestedCategory: "shoes", storeHint: "sneakers", priority: 90 });
  } else if (shoes === 0) {
    tips.push({ titleFa: "کفش ثبت نشده", reasonFa: "کفش خنثی پایه تقریباً هر استایل روزمره است.", suggestedCategory: "shoes", storeHint: "sneakers", priority: 80 });
  }
  if (jackets === 0 && wardrobe.length >= 3) tips.push({ titleFa: "لایه رویه کم است", reasonFa: "کاپشن برای پاییز/زمستان و موقعیت‌های کمی رسمی‌تر عمق می‌دهد.", suggestedCategory: "jacket", storeHint: "jacket", priority: 60 });
  if (wardrobe.length >= 4 && neutrals < 2) tips.push({ titleFa: "رنگ خنثی کم است", reasonFa: "مشکی/سفید/خاکستری ست کردن لباس‌های رنگی را آسان‌تر می‌کند.", suggestedCategory: "tshirt", priority: 50 });
  if (uppers >= 2 && lowers >= 2 && shoes >= 1 && tips.length === 0) {
    tips.push({ titleFa: "کمد برای شروع آماده‌ست", reasonFa: `حدود ${uppers * lowers} ترکیب بالا+پایین ممکن است. از ساخت استایل استفاده کن.`, suggestedCategory: "accessories", priority: 10 });
  }
  tips.sort((a, b) => b.priority - a.priority);
  return tips.slice(0, 4).map(({ priority: _p, ...rest }) => rest);
}
