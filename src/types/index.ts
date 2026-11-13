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

export type Size = "S" | "M" | "L" | "XL" | "XXL";
export type BudgetRange = "budget" | "mid" | "premium";
export type FitPreference = "oversized" | "regular" | "slim";

/** Category id — built-in or custom (admin can add more). */
export type ProductCategory = string;

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
  styles: FashionStyle[];
  occasions: Occasion[];
  colors: ColorPreference[];
  size: Size;
  budget: BudgetRange;
  fit: FitPreference;
}
