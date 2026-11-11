import { Product } from "@/types";
import { CATALOG_STORAGE_KEY } from "@/lib/catalog-storage";

export const products: Product[] = [
  {
    id: "p1",
    name: "Oversized Boxy Tee",
    nameFa: "تی‌شرت باکسی اورسایز",
    description: "Heavyweight cotton oversized t-shirt with dropped shoulders.",
    descriptionFa: "تی‌شرت اورسایز پنبه‌ای سنگین با شانه‌های افتاده.",
    category: "oversized-tshirt",
    price: 890000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Olive", "Beige"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
    inStock: true,
    tags: ["oversized", "basic", "streetwear", "minimal"],
  },
  {
    id: "p2",
    name: "Graphic Print Tee",
    nameFa: "تی‌شرت گرافیک",
    description: "Bold graphic print on premium cotton.",
    descriptionFa: "چاپ گرافیک جسورانه روی پنبه باکیفیت.",
    category: "oversized-tshirt",
    price: 980000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray"],
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
    inStock: true,
    tags: ["graphic", "statement", "streetwear"],
  },
  {
    id: "p3",
    name: "Essential Heavy Hoodie",
    nameFa: "هودی سنگین ضروری",
    description: "Premium heavyweight fleece hoodie.",
    descriptionFa: "هودی فلیس سنگین با جیب کانگورویی.",
    category: "hoodie",
    price: 1890000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Olive", "Navy"],
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
    inStock: true,
    tags: ["hoodie", "layering", "casual", "streetwear"],
  },
  {
    id: "p4",
    name: "Zip-Up Tech Hoodie",
    nameFa: "هودی زیپی تک",
    description: "Technical fabric zip hoodie.",
    descriptionFa: "هودی زیپی با پارچه تکنیکال.",
    category: "hoodie",
    price: 2190000,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Gray", "Olive"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"],
    inStock: true,
    tags: ["tech", "zip", "sporty", "modern"],
  },
  {
    id: "p5",
    name: "Relaxed Cargo Pants",
    nameFa: "شلوار کارگو ریلکس",
    description: "Relaxed fit cargo pants with multiple pockets.",
    descriptionFa: "شلوار کارگو با فیت ریلکس و جیب‌های متعدد.",
    category: "cargo-pants",
    price: 1590000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Beige", "Khaki"],
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"],
    inStock: true,
    tags: ["cargo", "relaxed", "utility", "streetwear"],
  },
  {
    id: "p6",
    name: "Wide Leg Trousers",
    nameFa: "شلوار گشاد",
    description: "Wide leg tailored trousers.",
    descriptionFa: "شلوار گشاد با برش تمیز.",
    category: "cargo-pants",
    price: 1790000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige", "Gray"],
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"],
    inStock: true,
    tags: ["wide", "tailored", "minimal"],
  },
  {
    id: "p7",
    name: "Oversized Bomber Jacket",
    nameFa: "کاپشن بمبر اورسایز",
    description: "Oversized bomber jacket.",
    descriptionFa: "کاپشن بمبر اورسایز.",
    category: "jacket",
    price: 2890000,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
    inStock: true,
    tags: ["bomber", "outerwear", "streetwear"],
  },
  {
    id: "p8",
    name: "Lightweight Windbreaker",
    nameFa: "بادگیر سبک",
    description: "Packable lightweight windbreaker.",
    descriptionFa: "بادگیر سبک و جمع‌شو.",
    category: "jacket",
    price: 1690000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Gray"],
    images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"],
    inStock: true,
    tags: ["windbreaker", "light", "sporty"],
  },
  {
    id: "p9",
    name: "Chunky Sole Sneakers",
    nameFa: "اسنیکرز زیره ضخیم",
    description: "Chunky sole everyday sneakers.",
    descriptionFa: "اسنیکرز روزمره با زیره ضخیم.",
    category: "sneakers",
    price: 2490000,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["White", "Black", "Gray"],
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"],
    inStock: true,
    tags: ["sneakers", "chunky", "streetwear"],
  },
  {
    id: "p10",
    name: "Minimal Court Sneakers",
    nameFa: "اسنیکرز کورت مینیمال",
    description: "Clean court-style sneakers.",
    descriptionFa: "اسنیکرز کورت مینیمال.",
    category: "sneakers",
    price: 1990000,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["White", "Black"],
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"],
    inStock: true,
    tags: ["court", "minimal", "clean"],
  },
  {
    id: "p11",
    name: "Structured Cap",
    nameFa: "کلاه ساختار‌دار",
    description: "Structured cotton cap.",
    descriptionFa: "کلاه نخی ساختار‌دار.",
    category: "accessories",
    price: 490000,
    sizes: ["M"],
    colors: ["Black", "Beige", "Olive"],
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80"],
    inStock: true,
    tags: ["cap", "accessory"],
  },
  {
    id: "p12",
    name: "Minimal Crossbody Bag",
    nameFa: "کیف کراس‌بادی مینیمال",
    description: "Compact crossbody bag.",
    descriptionFa: "کیف کراس‌بادی جمع‌وجور.",
    category: "accessories",
    price: 890000,
    sizes: ["M"],
    colors: ["Black", "Olive", "Gray"],
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
    inStock: true,
    tags: ["bag", "crossbody", "utility"],
  },
];

export type LiveProduct = Product & { stock?: number; originalPrice?: number };

function readLiveCatalog(): LiveProduct[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LiveProduct[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Base seed + admin overrides from localStorage (client). */
export function getAllProducts(): LiveProduct[] {
  return readLiveCatalog() ?? products;
}

export function getProductById(id: string): LiveProduct | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductsByCategory(category: string): LiveProduct[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export function getOutfitTotalPrice(productIds: string[]): number {
  const list = getAllProducts();
  return productIds.reduce((sum, id) => {
    const p = list.find((x) => x.id === id);
    return sum + (p?.price ?? 0);
  }, 0);
}
