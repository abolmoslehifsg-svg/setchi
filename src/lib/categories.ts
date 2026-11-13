import { ProductCategory } from "@/types";

export type CategoryOption = { value: ProductCategory; label: string };

const STORAGE_KEY = "setchi_categories_v1";

/** Built-in categories — always available as starting set. */
export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { value: "oversized-tshirt", label: "تی‌شرت اورسایز" },
  { value: "hoodie", label: "هودی" },
  { value: "cargo-pants", label: "شلوار / کارگو" },
  { value: "jacket", label: "کاپشن / کت" },
  { value: "sneakers", label: "کفش" },
  { value: "accessories", label: "اکسسوری" },
];

/** @deprecated use loadCategories / getCategoryLabel */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  DEFAULT_CATEGORIES.map((c) => [c.value, c.label])
);

export function loadCategories(): CategoryOption[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw) as CategoryOption[];
    if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_CATEGORIES;
    return parsed.filter((c) => c && typeof c.value === "string" && c.label);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(items: CategoryOption[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  try {
    window.dispatchEvent(new Event("setchi-categories-updated"));
  } catch {
    /* ignore */
  }
}

export function slugifyCategory(label: string): string {
  const trimmed = label.trim();
  const latin = trimmed
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (latin.length >= 2) return latin.slice(0, 48);
  return `cat_${Date.now().toString(36)}`;
}

export function addCategory(label: string): CategoryOption[] {
  const name = label.trim();
  if (!name) return loadCategories();
  const list = loadCategories();
  if (list.some((c) => c.label === name || c.value === name)) return list;
  let value = slugifyCategory(name);
  if (list.some((c) => c.value === value)) {
    value = `${value}_${Date.now().toString(36).slice(-4)}`;
  }
  const next = [...list, { value, label: name }];
  saveCategories(next);
  return next;
}

export function removeCategory(value: string): CategoryOption[] {
  const filtered = loadCategories().filter((c) => c.value !== value);
  const next = filtered.length ? filtered : DEFAULT_CATEGORIES;
  saveCategories(next);
  return next;
}

export function renameCategory(value: string, label: string): CategoryOption[] {
  const name = label.trim();
  if (!name) return loadCategories();
  const next = loadCategories().map((c) =>
    c.value === value ? { ...c, label: name } : c
  );
  saveCategories(next);
  return next;
}

export function resetCategories(): CategoryOption[] {
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

export function getCategoryLabel(value: string): string {
  const found = loadCategories().find((c) => c.value === value);
  if (found) return found.label;
  return CATEGORY_LABELS[value] || value;
}
