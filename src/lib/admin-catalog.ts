"use client";

import { products as baseProducts } from "@/data/products";
import { CATALOG_STORAGE_KEY, CATALOG_UPDATED_EVENT } from "@/lib/catalog-storage";
import { parseIntLoose } from "@/lib/numbers";
import { findCategoryByText } from "@/lib/categories";
import { Product, ProductCategory, ProductStatus, Size } from "@/types";
import { recordPriceChange, recordSale } from "./admin-stats";

export type CatalogProduct = Product & {
  stock: number;
  originalPrice?: number;
  status?: ProductStatus;
};

export type NewProductInput = Omit<CatalogProduct, "id" | "inStock" | "status"> & {
  id?: string;
  status?: ProductStatus;
};

export class CatalogStorageError extends Error {}

const DEFAULT_STOCK = 10;
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80";

function fromBase(): CatalogProduct[] {
  return baseProducts.map((p) => ({
    ...p,
    stock: p.inStock === false ? 0 : DEFAULT_STOCK,
    inStock: p.inStock !== false,
    status: p.status ?? "open",
  }));
}

export function loadCatalog(): CatalogProduct[] {
  if (typeof window === "undefined") return fromBase();
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return fromBase();
    const parsed = JSON.parse(raw) as CatalogProduct[];
    if (!Array.isArray(parsed) || !parsed.length) return fromBase();
    return parsed.map((p) => ({
      ...p,
      stock: typeof p.stock === "number" ? p.stock : DEFAULT_STOCK,
      inStock: (p.stock ?? 0) > 0,
      status: p.status ?? "open",
    }));
  } catch {
    return fromBase();
  }
}

function saveCatalog(items: CatalogProduct[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CATALOG_STORAGE_KEY,
      JSON.stringify(items.map((p) => ({ ...p, inStock: p.stock > 0 })))
    );
  } catch {
    throw new CatalogStorageError("فضای مرورگر پر است؛ عکس‌ها را کم‌حجم‌تر کنید.");
  }
  try {
    window.dispatchEvent(new Event(CATALOG_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

function uidProduct() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const hasRealImage = (p: Pick<Product, "images">) =>
  Boolean(p.images?.length && p.images[0] && p.images[0] !== FALLBACK_IMAGE);

export function publishIssues(p: CatalogProduct): { blocking: string[]; warnings: string[] } {
  const blocking: string[] = [];
  const warnings: string[] = [];
  if (!p.nameFa?.trim()) blocking.push("نام فارسی لازم است");
  if (!p.price || p.price <= 0) blocking.push("قیمت معتبر لازم است");
  if (!hasRealImage(p)) warnings.push("عکس واقعی ندارد");
  if (!p.sizes?.length) warnings.push("سایزی تعریف نشده");
  return { blocking, warnings };
}

export function addProduct(data: NewProductInput): CatalogProduct[] {
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
    status: data.status ?? "draft",
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
  const found = findCategoryByText(raw);
  if (found) return found.id;
  const s = raw.toLowerCase().trim();
  if (!s) return "accessories";
  return s.replace(/\s+/g, "-").slice(0, 48) || "accessories";
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

export function importCsvMerge(text: string): CatalogProduct[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return loadCatalog();

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const col = (names: string[]) =>
    headers.findIndex((h) => names.some((n) => h.includes(n)));

  const iNameFa = col(["namefa", "نام", "name_fa"]);
  const iName = col(["name", "عنوان"]);
  const iCat = col(["category", "دسته", "cat"]);
  const iPrice = col(["price", "قیمت"]);
  const iStock = col(["stock", "موجودی", "inventory", "qty", "quantity"]);

  for (let r = 1; r < lines.length; r++) {
    const cols = splitCsvLine(lines[r]);
    const nameFa =
      (iNameFa >= 0 ? cols[iNameFa] : "") ||
      (iName >= 0 ? cols[iName] : "") ||
      `محصول ${r}`;
    const name = (iName >= 0 ? cols[iName] : "") || nameFa;
    const category = normalizeCategory(iCat >= 0 ? cols[iCat] : "accessories");
    const price = Math.max(0, parseIntLoose(String(iPrice >= 0 ? cols[iPrice] : "0")));
    const stock = Math.max(
      0,
      parseIntLoose(String(iStock >= 0 ? cols[iStock] : String(DEFAULT_STOCK)), DEFAULT_STOCK)
    );
    addProduct({
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
      status: "open",
    });
  }
  return loadCatalog();
}
