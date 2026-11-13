export type FashionStyle =
  | "streetwear"
  | "casual"
  | "sporty"
  | "minimalist"
  | "modern"
  | "smart-casual";

export type Occasion =
  | "daily"
  | "university"
  | "party"
  | "casual-outings"
  | "work"
  | "sport";

export type ColorPreference =
  | "black"
  | "white"
  | "gray"
  | "beige"
  | "navy"
  | "olive"
  | "brown"
  | "earth"
  | "colorful";

/** Free text on purpose: "M", "42", "28/30", "FREE"… (see lib/sizes.ts). */
export type Size = string;
export type BudgetRange = "budget" | "mid" | "premium";
export type FitPreference = "oversized" | "regular" | "slim";

export type BuiltinCategory =
  | "oversized-tshirt"
  | "hoodie"
  | "cargo-pants"
  | "jacket"
  | "sneakers"
  | "accessories";

export type ProductCategory = string;

export type ProductStatus = "draft" | "open" | "closed";

export interface Product {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  category: ProductCategory;
  price: number;
  sizes: Size[];
  colors: string[];
  images: string[];
  tags: string[];
  fit?: FitPreference;
  inStock?: boolean;
  status?: ProductStatus;
}

export interface OutfitItem {
  productId: string;
  role: string;
}

export interface Outfit {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  style: FashionStyle[];
  occasion: Occasion[];
  colors: string[];
  image: string;
  items: OutfitItem[];
  estimatedPrice: number;
  whyItWorks: string;
  whyItWorksFa: string;
  tags: string[];
  fit?: FitPreference;
}

export interface UserPreferences {
  gender: "male";
  ageRange: string;
  styles: FashionStyle[];
  colors: ColorPreference[];
  sizes: { top?: Size; bottom?: Size; shoes?: string };
  budget: BudgetRange;
  occasion: Occasion[];
  preferredItems: ProductCategory[];
  fit?: FitPreference;
  dislikedStyles?: FashionStyle[];
  heightRange?: string;
  ownedItems?: ProductCategory[];
  photoUrl?: string;
}

export interface RecommendationResult {
  outfit: Outfit;
  matchScore: number;
  explanation: string;
  explanationFa: string;
}
