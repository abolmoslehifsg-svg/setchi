export type WardrobeCategory =
  | "tshirt"
  | "shirt"
  | "hoodie"
  | "sweater"
  | "jacket"
  | "pants"
  | "jeans"
  | "shorts"
  | "shoes"
  | "accessories";

export type WardrobeSeason = "spring" | "summer" | "fall" | "winter" | "all";
export type WardrobeFit = "oversized" | "regular" | "slim";
export type WardrobePattern = "solid" | "striped" | "checked" | "printed" | "other";
export type WardrobeStyle = "streetwear" | "casual" | "minimal" | "sporty" | "smart-casual";
export type WardrobeOccasion =
  | "everyday"
  | "school"
  | "work"
  | "party"
  | "date"
  | "formal"
  | "sports";

export interface WardrobeItem {
  id: string;
  imageData: string;
  name: string;
  category: WardrobeCategory;
  subcategory?: string;
  mainColor: string;
  secondaryColors: string[];
  pattern: WardrobePattern;
  style: WardrobeStyle;
  season: WardrobeSeason;
  fit: WardrobeFit;
  brand?: string;
  size?: string;
  notes?: string;
  favorite?: boolean;
  createdAt: number;
}

export interface WardrobeOutfit {
  id: string;
  name: string;
  itemIds: string[];
  occasion?: WardrobeOccasion;
  score: number;
  explanationFa: string;
  savedAt: number;
}

export interface WardrobePrefs {
  occasion?: WardrobeOccasion;
  style?: WardrobeStyle;
  season?: WardrobeSeason;
  preferredColors: string[];
  dislikedColors: string[];
  fit?: WardrobeFit;
}

export const CATEGORY_LABELS: Record<WardrobeCategory, string> = {
  tshirt: "تی‌شرت",
  shirt: "پیراهن",
  hoodie: "هودی",
  sweater: "سویشرت / بافت",
  jacket: "کاپشن و کت",
  pants: "شلوار",
  jeans: "جین",
  shorts: "شلوارک",
  shoes: "کفش",
  accessories: "اکسسوری",
};

export const COLOR_OPTIONS = [
  { value: "black", label: "مشکی" },
  { value: "white", label: "سفید" },
  { value: "gray", label: "خاکستری" },
  { value: "beige", label: "بژ" },
  { value: "navy", label: "سرمه‌ای" },
  { value: "blue", label: "آبی" },
  { value: "olive", label: "زیتونی" },
  { value: "brown", label: "قهوه‌ای" },
  { value: "green", label: "سبز" },
  { value: "red", label: "قرمز" },
  { value: "other", label: "سایر" },
];

export const UPPER_CATEGORIES: WardrobeCategory[] = ["tshirt", "shirt", "hoodie", "sweater"];
export const LOWER_CATEGORIES: WardrobeCategory[] = ["pants", "jeans", "shorts"];
export const SHOE_CATEGORIES: WardrobeCategory[] = ["shoes"];
export const OUTER_CATEGORIES: WardrobeCategory[] = ["jacket"];
