export type FashionStyle =
  | "streetwear"
  | "casual"
  | "sporty"
  | "minimalist"
  | "modern";

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

export type Size = "S" | "M" | "L" | "XL" | "XXL";

export type BudgetRange = "budget" | "mid" | "premium";

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
}

export type ProductCategory =
  | "oversized-tshirt"
  | "hoodie"
  | "cargo-pants"
  | "jacket"
  | "sneakers"
  | "accessories";

export interface OutfitItem {
  productId: string;
  role: string; // e.g. "top", "bottom", "footwear", "outer"
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
}

export interface UserPreferences {
  gender: "male";
  ageRange: string;
  styles: FashionStyle[];
  colors: ColorPreference[];
  sizes: {
    top?: Size;
    bottom?: Size;
    shoes?: string;
  };
  budget: BudgetRange;
  occasion: Occasion[];
  preferredItems: ProductCategory[];
  photoUrl?: string;
}

export interface RecommendationResult {
  outfit: Outfit;
  matchScore: number;
  explanation: string;
  explanationFa: string;
}
