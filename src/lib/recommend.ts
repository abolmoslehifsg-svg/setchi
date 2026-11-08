import { outfits } from "@/data/outfits";
import {
  Outfit,
  UserPreferences,
  RecommendationResult,
  FashionStyle,
  Occasion,
  BudgetRange,
} from "@/types";

function scoreOutfit(outfit: Outfit, prefs: UserPreferences): number {
  let score = 0;

  // Style match (high weight)
  const styleMatches = prefs.styles.filter((s) => outfit.style.includes(s)).length;
  score += styleMatches * 25;

  // Occasion match
  const occasionMatches = prefs.occasion.filter((o) =>
    outfit.occasion.includes(o)
  ).length;
  score += occasionMatches * 20;

  // Color preference
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

  const preferredColorNames = prefs.colors.flatMap(
    (c) => colorMap[c] || [c]
  );
  const colorHits = outfit.colors.filter((c) =>
    preferredColorNames.some(
      (pc) => c.toLowerCase().includes(pc.toLowerCase()) || pc.toLowerCase().includes(c.toLowerCase())
    )
  ).length;
  score += colorHits * 10;

  // Budget
  const budgetRanges: Record<BudgetRange, [number, number]> = {
    budget: [0, 5000000],
    mid: [4000000, 9000000],
    premium: [7000000, 20000000],
  };
  const [minB, maxB] = budgetRanges[prefs.budget];
  if (outfit.estimatedPrice >= minB && outfit.estimatedPrice <= maxB) {
    score += 15;
  } else if (
    outfit.estimatedPrice < minB * 1.3 &&
    outfit.estimatedPrice > maxB * 0.7
  ) {
    score += 5;
  }

  // Preferred items presence
  // (simplified: if outfit has items in preferred categories, bonus)
  // We don't have full product lookup here for speed; assume good data coverage

  // Base diversity bonus to avoid always same top
  score += Math.random() * 5;

  return Math.min(100, Math.round(score));
}

function buildExplanation(
  outfit: Outfit,
  prefs: UserPreferences,
  score: number
): { en: string; fa: string } {
  const styleText = prefs.styles.length
    ? prefs.styles.join("، ")
    : "عمومی";
  const occasionText = prefs.occasion.length
    ? prefs.occasion.join("، ")
    : "روزمره";

  return {
    en: `This look scored ${score}/100 for your preferences. It aligns with your interest in ${prefs.styles.join(", ") || "versatile"} styles and works well for ${prefs.occasion.join(", ") || "everyday"} occasions. ${outfit.whyItWorks}`,
    fa: `این ست امتیاز ${score} از ۱۰۰ را برای ترجیحات شما کسب کرد. با علاقه‌مندی شما به استایل‌های ${styleText} هم‌خوانی دارد و برای موقعیت‌های ${occasionText} مناسب است. ${outfit.whyItWorksFa}`,
  };
}

export function generateRecommendations(
  prefs: UserPreferences,
  limit = 4
): RecommendationResult[] {
  const scored: RecommendationResult[] = outfits.map((outfit) => {
    const matchScore = scoreOutfit(outfit, prefs);
    const { en, fa } = buildExplanation(outfit, prefs, matchScore);
    return {
      outfit,
      matchScore,
      explanation: en,
      explanationFa: fa,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Ensure diversity: prefer different primary styles if possible
  const selected: RecommendationResult[] = [];
  const usedStyles = new Set<string>();

  for (const item of scored) {
    if (selected.length >= limit) break;
    const primaryStyle = item.outfit.style[0];
    if (!usedStyles.has(primaryStyle) || selected.length < 2) {
      selected.push(item);
      usedStyles.add(primaryStyle);
    }
  }

  // Fill remaining if needed
  for (const item of scored) {
    if (selected.length >= limit) break;
    if (!selected.find((s) => s.outfit.id === item.outfit.id)) {
      selected.push(item);
    }
  }

  return selected;
}

export function getDefaultPreferences(): UserPreferences {
  return {
    gender: "male",
    ageRange: "18-25",
    styles: ["streetwear", "casual"],
    colors: ["black", "olive", "beige"],
    sizes: { top: "L", bottom: "L", shoes: "42" },
    budget: "mid",
    occasion: ["daily", "casual-outings"],
    preferredItems: ["oversized-tshirt", "hoodie", "cargo-pants"],
  };
}
