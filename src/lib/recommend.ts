import { outfits } from "@/data/outfits";
import { products, getProductById, getOutfitTotalPrice } from "@/data/products";
import {
  Outfit,
  UserPreferences,
  RecommendationResult,
  BudgetRange,
  FashionStyle,
} from "@/types";

function scoreOutfit(outfit: Outfit, prefs: UserPreferences): number {
  let score = 0;

  if (prefs.dislikedStyles?.length) {
    if (outfit.style.some((s) => prefs.dislikedStyles!.includes(s))) {
      return 0;
    }
  }

  const styleMatches = prefs.styles.filter((s) => outfit.style.includes(s)).length;
  score += styleMatches * 28;

  const occasionMatches = prefs.occasion.filter((o) =>
    outfit.occasion.includes(o)
  ).length;
  score += occasionMatches * 22;

  const colorMap: Record<string, string[]> = {
    black: ["Black"],
    white: ["White"],
    gray: ["Gray"],
    beige: ["Beige", "Khaki"],
    navy: ["Navy"],
    olive: ["Olive"],
    brown: ["Brown", "Beige"],
    earth: ["Olive", "Beige", "Brown", "Khaki"],
    colorful: ["Black", "White", "Gray", "Olive", "Beige"],
  };
  const preferred = prefs.colors.flatMap((c) => colorMap[c] || [c]);
  const colorHits = outfit.colors.filter((c) =>
    preferred.some(
      (pc) =>
        c.toLowerCase().includes(pc.toLowerCase()) ||
        pc.toLowerCase().includes(c.toLowerCase())
    )
  ).length;
  score += colorHits * 12;

  // Non-overlapping ranges (toman)
  const budgetRanges: Record<BudgetRange, [number, number]> = {
    budget: [0, 4999999],
    mid: [5000000, 7999999],
    premium: [8000000, 50000000],
  };
  const [minB, maxB] = budgetRanges[prefs.budget];
  const totalPrice =
    getOutfitTotalPrice(outfit.items.map((i) => i.productId)) ||
    outfit.estimatedPrice;
  if (totalPrice >= minB && totalPrice <= maxB) score += 18;
  else if (totalPrice < minB * 1.25 && totalPrice > maxB * 0.75) score += 6;

  if (prefs.fit && outfit.fit === prefs.fit) score += 12;
  else if (prefs.fit && outfit.tags?.includes(prefs.fit)) score += 8;

  if (prefs.preferredItems?.length) {
    const roles = outfit.items
      .map((i) => getProductById(i.productId)?.category)
      .filter(Boolean);
    const hits = prefs.preferredItems.filter((p) => roles.includes(p)).length;
    score += hits * 6;
  }

  score += outfit.id.charCodeAt(1) % 7;

  return Math.min(100, Math.round(score));
}

function buildExplanation(
  outfit: Outfit,
  prefs: UserPreferences,
  score: number
): { en: string; fa: string } {
  const reasonsFa: string[] = [];
  const styleHits = prefs.styles.filter((s) => outfit.style.includes(s));
  if (styleHits.length) {
    reasonsFa.push(`هم‌راستا با استایل ${styleHits.join("، ")}`);
  }
  const occHits = prefs.occasion.filter((o) => outfit.occasion.includes(o));
  if (occHits.length) {
    reasonsFa.push("مناسب موقعیت‌های انتخاب‌شده");
  }
  reasonsFa.push(outfit.whyItWorksFa);
  const fa =
    reasonsFa.slice(0, 3).join(" · ") +
    (score >= 70 ? " · تطابق بالا با ترجیحات تو" : "");
  return { en: outfit.whyItWorks, fa };
}

export function generateRecommendations(
  prefs: UserPreferences,
  limit = 4
): RecommendationResult[] {
  const scored = outfits
    .map((outfit) => {
      const matchScore = scoreOutfit(outfit, prefs);
      const explanation = buildExplanation(outfit, prefs, matchScore);
      return {
        outfit,
        matchScore,
        explanation: explanation.en,
        explanationFa: explanation.fa,
      };
    })
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return scored;
}

export function replaceOutfitItem(
  outfit: Outfit,
  role: string,
  newProductId: string
): Outfit {
  const items = outfit.items.map((i) =>
    i.role === role ? { ...i, productId: newProductId } : i
  );
  const newPrice = getOutfitTotalPrice(items.map((i) => i.productId));
  return { ...outfit, items, estimatedPrice: newPrice };
}

export function getDefaultPreferences(): UserPreferences {
  return {
    gender: "male",
    ageRange: "18-25",
    styles: ["casual"],
    colors: ["black", "white"],
    sizes: {},
    budget: "mid",
    occasion: ["daily"],
    preferredItems: [],
  };
}
