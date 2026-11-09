import { WardrobeItem, WardrobeOutfit, WardrobePrefs } from "./types";

const ITEMS_KEY = "setchi_wardrobe_items_v1";
const OUTFITS_KEY = "setchi_wardrobe_outfits_v1";
const PREFS_KEY = "setchi_wardrobe_prefs_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadItems(): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(ITEMS_KEY), []);
}

export function saveItems(items: WardrobeItem[]) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function loadOutfits(): WardrobeOutfit[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(OUTFITS_KEY), []);
}

export function saveOutfits(outfits: WardrobeOutfit[]) {
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}

export function loadPrefs(): WardrobePrefs {
  if (typeof window === "undefined") {
    return { preferredColors: [], dislikedColors: [] };
  }
  return safeParse(localStorage.getItem(PREFS_KEY), {
    preferredColors: [],
    dislikedColors: [],
  });
}

export function savePrefs(prefs: WardrobePrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function compressImage(file: File, maxWidth = 480, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("تصویر نامعتبر است"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas در دسترس نیست"));
          return;
        }
        ctx.fillStyle = "#F5F4F0";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function uid() {
  return `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
