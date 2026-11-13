import { BuiltinCategory, ProductCategory, Size } from "@/types";
import { CATEGORIES_STORAGE_KEY, CATEGORIES_UPDATED_EVENT } from "./catalog-storage";
import { FREE_SIZE, LETTER_SIZES, SHOE_SIZES, WAIST_SIZES } from "./sizes";

export interface Category {
  id: ProductCategory;
  label: string;
  sizes: Size[];
  custom: boolean;
}

export const BUILTIN_CATEGORIES: Category[] = [
  { id: "oversized-tshirt", label: "تی‌شرت اورسایز", sizes: LETTER_SIZES, custom: false },
  { id: "hoodie", label: "هودی", sizes: LETTER_SIZES, custom: false },
  { id: "cargo-pants", label: "شلوار کارگو", sizes: WAIST_SIZES, custom: false },
  { id: "jacket", label: "کاپشن", sizes: LETTER_SIZES, custom: false },
  { id: "sneakers", label: "اسنیکرز", sizes: SHOE_SIZES, custom: false },
  { id: "accessories", label: "اکسسوری", sizes: FREE_SIZE, custom: false },
];

/** Built-in labels map (legacy callers). Prefer categoryLabel() for custom categories. */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  BUILTIN_CATEGORIES.map((c) => [c.id, c.label])
);

const SYNONYMS: Record<BuiltinCategory, string[]> = {
  "oversized-tshirt": ["tshirt", "tee", "تیشرت", "تی شرت", "تی‌شرت", "تیشرت اورسایز"],
  hoodie: ["hoodie", "هودی", "سویشرت"],
  "cargo-pants": ["cargo", "pants", "شلوار", "شلوار کارگو"],
  jacket: ["jacket", "coat", "کاپشن", "کت"],
  sneakers: ["sneaker", "sneakers", "shoe", "shoes", "کفش", "کتانی", "اسنیکرز"],
  accessories: ["accessory", "accessories", "اکسسوری", "اکسسوری ها"],
};

const MAX_LABEL_LENGTH = 40;

const normalize = (s: string) => s.toLowerCase().replace(/[\s\u200c_-]+/g, "");

function newCategoryId() {
  return `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function loadCustomCategories(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => c && typeof c.id === "string" && typeof c.label === "string")
      .map((c) => ({
        id: c.id,
        label: c.label,
        sizes: Array.isArray(c.sizes) && c.sizes.length ? c.sizes : [...LETTER_SIZES],
        custom: true,
      }));
  } catch {
    return [];
  }
}

function saveCustomCategories(list: Category[]) {
  localStorage.setItem(
    CATEGORIES_STORAGE_KEY,
    JSON.stringify(list.map(({ id, label, sizes }) => ({ id, label, sizes })))
  );
  try {
    window.dispatchEvent(new Event(CATEGORIES_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

export function getAllCategories(): Category[] {
  return [...BUILTIN_CATEGORIES, ...loadCustomCategories()];
}

/** @deprecated use getAllCategories */
export function loadCategories(): { value: string; label: string }[] {
  return getAllCategories().map((c) => ({ value: c.id, label: c.label }));
}

export function categoryLabel(id: ProductCategory, list: Category[] = getAllCategories()): string {
  return list.find((c) => c.id === id)?.label ?? CATEGORY_LABELS[id] ?? id;
}

export function defaultSizesFor(id: ProductCategory, list: Category[] = getAllCategories()): Size[] {
  return [...(list.find((c) => c.id === id)?.sizes ?? LETTER_SIZES)];
}

export function findCategoryByText(raw: string, synonyms = true): Category | undefined {
  const key = normalize(raw);
  if (!key) return undefined;
  const all = getAllCategories();
  const direct = all.find((c) => normalize(c.id) === key || normalize(c.label) === key);
  if (direct || !synonyms) return direct;
  const builtinId = (Object.keys(SYNONYMS) as BuiltinCategory[]).find((id) =>
    SYNONYMS[id].some((s) => normalize(s) === key)
  );
  return all.find((c) => c.id === builtinId);
}

export function addCategory(
  label: string,
  sizes: Size[] = []
): { category?: Category; created: boolean; error?: string } {
  const name = label.trim().slice(0, MAX_LABEL_LENGTH);
  if (!name) return { created: false, error: "نام دسته لازم است" };
  const existing = findCategoryByText(name, false);
  if (existing) return { category: existing, created: false };
  const category: Category = {
    id: newCategoryId(),
    label: name,
    sizes: sizes.length ? sizes : [...LETTER_SIZES],
    custom: true,
  };
  saveCustomCategories([...loadCustomCategories(), category]);
  return { category, created: true };
}

export function removeCategory(id: ProductCategory): boolean {
  const custom = loadCustomCategories();
  if (!custom.some((c) => c.id === id)) return false;
  saveCustomCategories(custom.filter((c) => c.id !== id));
  return true;
}
