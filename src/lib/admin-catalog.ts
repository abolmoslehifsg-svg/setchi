"use client";

import { products as baseProducts } from "@/data/products";
import { Product, ProductCategory, Size } from "@/types";
import { recordPriceChange, recordSale } from "./admin-stats";

export type CatalogProduct = Product & { stock: number; originalPrice?: number };

const KEY = "setchi_catalog_v1";
const DEFAULT_STOCK = 10;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80";

function fromBase(): CatalogProduct[] {
  return baseProducts.map((p) => ({
    ...p,
    stock: p.inStock === false ? 0 : DEFAULT_STOCK,
    inStock: p.inStock !== false,
  }));
}

export function loadCatalog(): CatalogProduct[] {
  if (typeof window === "undefined") return fromBase();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fromBase();
    const parsed = JSON.parse(raw) as CatalogProduct[];
    if (!Array.isArray(parsed) || !parsed.length) return fromBase();
    return parsed.map((p) => ({
      ...p,
      stock: typeof p.stock === "number" ? p.stock : DEFAULT_STOCK,
      inStock: (p.stock ?? 0) > 0,
    }));
  } catch {
    return fromBase();
  }
}

export function saveCatalog(items: CatalogProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify(items.map((p) => ({ ...p, inStock: p.stock > 0 })))
  );
}

function uidProduct() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function addProduct(
  data: Omit<CatalogProduct, "id" | "inStock"> & { id?: string }
): CatalogProduct[] {
  const list = loadCatalog();
  const stock = data.stock ?? DEFAULT_STOCK;
  const item: CatalogProduct = {
    id: data.id || uidProduct(),
    name: data.name,
    nameFa: data.nameFa,
    description: data.description || "",
    descriptionFa: data.descriptionFa || "",
    category: data.category,
    price: data.price,
    sizes: data.sizes?.length ? data.sizes : (["M", "L"] as Size[]),
    colors: data.colors?.length ? data.colors : ["Black"],
    images: data.images?.length ? data.images : [FALLBACK_IMAGE],
    tags: data.tags || [],
    stock,
    originalPrice: data.originalPrice,
    inStock: stock > 0,
  };
  const next = [item, ...list];
  saveCatalog(next);
  return next;
}

export function updateProduct(id: string, patch: Partial<CatalogProduct>) {
  const list = loadCatalog().map((p) => {
    if (p.id !== id) return p;
    if (typeof patch.price === "number" && patch.price !== p.price) {
      recordPriceChange({
        productId: p.id,
        nameFa: p.nameFa,
        from: p.price,
        to: patch.price,
        source: "manual",
      });
    }
    const merged = { ...p, ...patch };
    if (typeof merged.stock === "number") merged.inStock = merged.stock > 0;
    return merged;
  });
  saveCatalog(list);
  return list;
}

export function removeProduct(id: string) {
  const list = loadCatalog().filter((p) => p.id !== id);
  saveCatalog(list);
  return list;
}

export function sellOne(id: string) {
  const cur = loadCatalog().find((p) => p.id === id);
  if (!cur || cur.stock <= 0) return loadCatalog();
  recordSale(cur.id, cur.nameFa, cur.price);
  return updateProduct(id, { stock: Math.max(0, cur.stock - 1) });
}

export function applyCategoryDiscount(
  category: ProductCategory | "all",
  percent: number
) {
  const pct = Math.min(90, Math.max(0, percent));
  const list = loadCatalog().map((p) => {
    if (category !== "all" && p.category !== category) return p;
    const base = p.originalPrice ?? p.price;
    const next = Math.round(base * (1 - pct / 100));
    if (next !== p.price) {
      recordPriceChange({
        productId: p.id,
        nameFa: p.nameFa,
        from: p.price,
        to: next,
        source: "discount",
      });
    }
    return { ...p, originalPrice: base, price: next };
  });
  saveCatalog(list);
  return list;
}

export function clearCategoryDiscount(category: ProductCategory | "all") {
  const list = loadCatalog().map((p) => {
    if (category !== "all" && p.category !== category) return p;
    if (p.originalPrice == null) return p;
    if (p.originalPrice !== p.price) {
      recordPriceChange({
        productId: p.id,
        nameFa: p.nameFa,
        from: p.price,
        to: p.originalPrice,
        source: "clear-discount",
      });
    }
    return { ...p, price: p.originalPrice, originalPrice: undefined };
  });
  saveCatalog(list);
  return list;
}

/** افزایش روی قیمت اصلی؛ نسبت تخفیف فعال حفظ می‌شود. */
export function applyCategoryPriceIncrease(
  category: ProductCategory | "all",
  percent: number
) {
  const pct = Math.min(200, Math.max(0, percent));
  const list = loadCatalog().map((p) => {
    if (category !== "all" && p.category !== category) return p;
    const base = p.originalPrice ?? p.price;
    const nextBase = Math.round(base * (1 + pct / 100));
    const hasDiscount = p.originalPrice != null && p.originalPrice !== p.price;
    const nextPrice = hasDiscount
      ? Math.round(nextBase * (p.price / p.originalPrice!))
      : nextBase;
    if (nextPrice !== p.price) {
      recordPriceChange({
        productId: p.id,
        nameFa: p.nameFa,
        from: p.price,
        to: nextPrice,
        source: "increase",
      });
    }
    return {
      ...p,
      price: nextPrice,
      originalPrice: hasDiscount ? nextBase : undefined,
    };
  });
  saveCatalog(list);
  return list;
}

export function resetCatalogToBase() {
  const list = fromBase();
  saveCatalog(list);
  return list;
}

function normalizeCategory(raw: string): ProductCategory {
  const s = raw.toLowerCase().trim();
  if (s.includes("tshirt") || s.includes("tee") || s.includes("تی")) return "oversized-tshirt";
  if (s.includes("hoodie") || s.includes("هودی")) return "hoodie";
  if (s.includes("cargo") || s.includes("pants") || s.includes("شلوار")) return "cargo-pants";
  if (s.includes("jacket") || s.includes("کت") || s.includes("کاپشن")) return "jacket";
  if (s.includes("sneaker") || s.includes("shoe") || s.includes("کفش")) return "sneakers";
  return "accessories";
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (const c of line) {
    if (c === '"') {
      quoted = !quoted;
      continue;
    }
    if ((c === "," || c === ";") && !quoted) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

export function parseProductsCsv(text: string) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [] as Omit<CatalogProduct, "id" | "inStock">[];

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const col = (names: string[]) =>
    headers.findIndex((h) => names.some((n) => h.includes(n)));

  const iNameFa = col(["namefa", "نام", "name_fa"]);
  const iName = col(["name", "عنوان"]);
  const iCat = col(["category", "دسته", "cat"]);
  const iPrice = col(["price", "قیمت"]);
  const iStock = col(["stock", "موجودی", "inventory", "qty", "quantity"]);

  const rows: Omit<CatalogProduct, "id" | "inStock">[] = [];
  for (let r = 1; r < lines.length; r++) {
    const cols = splitCsvLine(lines[r]);
    const nameFa =
      (iNameFa >= 0 ? cols[iNameFa] : "") ||
      (iName >= 0 ? cols[iName] : "") ||
      `محصول ${r}`;
    const name = (iName >= 0 ? cols[iName] : "") || nameFa;
    const category = normalizeCategory(iCat >= 0 ? cols[iCat] : "accessories");
    const price = Math.max(
      0,
      parseInt(String(iPrice >= 0 ? cols[iPrice] : "0").replace(/[^\d]/g, ""), 10) || 0
    );
    const stock = Math.max(
      0,
      parseInt(
        String(iStock >= 0 ? cols[iStock] : String(DEFAULT_STOCK)).replace(/[^\d]/g, ""),
        10
      ) || DEFAULT_STOCK
    );
    rows.push({
      name,
      nameFa,
      description: "",
      descriptionFa: "",
      category,
      price,
      stock,
      sizes: ["M", "L"] as Size[],
      colors: ["Black"],
      images: [FALLBACK_IMAGE],
      tags: [],
    });
  }
  return rows;
}

export function importCsvMerge(text: string) {
  for (const row of parseProductsCsv(text)) addProduct(row);
  return loadCatalog();
}

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "oversized-tshirt", label: "تی‌شرت اورسایز" },
  { value: "hoodie", label: "هودی" },
  { value: "cargo-pants", label: "شلوار / کارگو" },
  { value: "jacket", label: "کاپشن / کت" },
  { value: "sneakers", label: "کفش" },
  { value: "accessories", label: "اکسسوری" },
];
