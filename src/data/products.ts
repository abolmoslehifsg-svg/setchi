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
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Olive"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
    inStock: true,
    tags: ["basic", "oversized", "cotton"],
  },
  {
    id: "p2",
    name: "Graphic Print Tee",
    nameFa: "تی‌شرت گرافیک",
    description: "Soft cotton tee with minimal front graphic.",
    descriptionFa: "تی‌شرت نخی نرم با طرح مینیمال جلو.",
    category: "oversized-tshirt",
    price: 980000,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Gray"],
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"],
    inStock: true,
    tags: ["graphic", "street"],
  },
  {
    id: "p3",
    name: "Heavyweight Hoodie",
    nameFa: "هودی سنگین ضروری",
    description: "Fleece-lined heavyweight hoodie.",
    descriptionFa: "هودی سنگین با لایه فلیس.",
    category: "hoodie",
    price: 1890000,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
    inStock: true,
    tags: ["hoodie", "fleece", "winter"],
  },
  {
    id: "p4",
    name: "Zip Hoodie",
    nameFa: "هودی زیپی تک",
    description: "Clean zip-up hoodie.",
    descriptionFa: "هودی زیپی ساده و تمیز.",
    category: "hoodie",
    price: 2190000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive"],
    images: ["https://images.unsplash.com/photo-1509942777562-407e4fbad1ef?w=800&q=80"],
    inStock: true,
    tags: ["zip", "hoodie"],
  },
  {
    id: "p5",
    name: "Relaxed Cargo Pants",
    nameFa: "شلوار کارگو ریلکس",
    description: "Relaxed cargo pants with side pockets.",
    descriptionFa: "شلوار کارگو آزاد با جیب‌های کناری.",
    category: "cargo-pants",
    price: 1590000,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Black", "Olive"],
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"],
    inStock: true,
    tags: ["cargo", "relaxed"],
  },
  {
    id: "p6",
    name: "Wide Cargo Pants",
    nameFa: "شلوار گشاد",
    description: "Wide-leg cargo trousers.",
    descriptionFa: "شلوار کارگو پاگشاد.",
    category: "cargo-pants",
    price: 1790000,
    sizes: ["30", "32", "34", "36"],
    colors: ["Black", "Beige"],
    images: ["https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80"],
    inStock: true,
    tags: ["wide", "cargo"],
  },
  {
    id: "p7",
    name: "Bomber Jacket",
    nameFa: "کاپشن بمبر اورسایز",
    description: "Classic bomber silhouette, oversized fit.",
    descriptionFa: "بمبر کلاسیک با فیت اورسایز.",
    category: "jacket",
    price: 2890000,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
    inStock: true,
    tags: ["bomber", "jacket"],
  },
  {
    id: "p8",
    name: "Light Windbreaker",
    nameFa: "بادگیر سبک",
    description: "Packable windbreaker.",
    descriptionFa: "بادگیر سبک و جمع‌شو.",
    category: "jacket",
    price: 1690000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray"],
    images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"],
    inStock: true,
    tags: ["windbreaker", "light"],
  },
  {
    id: "p9",
    name: "Chunky Sneakers",
    nameFa: "اسنیکرز زیره ضخیم",
    description: "Chunky sole everyday sneakers.",
    descriptionFa: "اسنیکرز روزمره با زیره ضخیم.",
    category: "sneakers",
    price: 2490000,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["White", "Black", "Gray"],
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    inStock: true,
    tags: ["chunky", "sneakers"],
  },
  {
    id: "p10",
    name: "Minimal Court Sneakers",
    nameFa: "اسنیکرز کورت مینیمال",
    description: "Clean court-style sneakers.",
    descriptionFa: "اسنیکرز کورت ساده.",
    category: "sneakers",
    price: 1990000,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["White", "Black"],
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"],
    inStock: true,
    tags: ["court", "minimal"],
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
    tags: ["bag", "crossbody"],
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

export function getAllProducts(includeDrafts = false): LiveProduct[] {
  const list = readLiveCatalog() ?? products;
  return includeDrafts ? list : list.filter((p) => p.status !== "draft");
}

export function isOrderable(p: LiveProduct): boolean {
  return p.status !== "draft" && p.status !== "closed" && p.stock !== 0 && p.inStock !== false;
}

export function unavailableLabel(p: LiveProduct): string | null {
  if (p.status === "draft") return "پیش‌نویس";
  if (p.status === "closed") return "فروش موقتاً بسته است";
  if (p.stock === 0 || p.inStock === false) return "ناموجود";
  return null;
}

export function getProductById(id: string): LiveProduct | undefined {
  return getAllProducts().find((p) => p.id === id);
}

const SEED_IDS = new Set(products.map((p) => p.id));

export function productHref(id: string): string {
  return SEED_IDS.has(id)
    ? `/products/${id}/`
    : `/products/view/?id=${encodeURIComponent(id)}`;
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
