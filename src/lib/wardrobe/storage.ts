import { WardrobeItem, WardrobeOutfit, WardrobePrefs } from "./types";

const ITEMS_KEY = "setchi_wardrobe_items_v1";
const OUTFITS_KEY = "setchi_wardrobe_outfits_v1";
const PREFS_KEY = "setchi_wardrobe_prefs_v1";
const IDB_NAME = "setchi_wardrobe_idb_v1";
const IDB_STORE = "kv";
const IDB_ITEMS_KEY = "items";

/** کش حافظه برای دسترسی همزمان (TodayStyle و …) */
let itemsCache: WardrobeItem[] | null = null;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB پشتیبانی نمی‌شود"));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("باز کردن دیتابیس ناموفق"));
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const store = tx.objectStore(IDB_STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    const store = tx.objectStore(IDB_STORE);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/** همگام — از کش (بعد از loadItemsAsync پر می‌شود) یا localStorage قدیمی */
export function loadItems(): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  if (itemsCache) return itemsCache;
  const legacy = safeParse<WardrobeItem[]>(localStorage.getItem(ITEMS_KEY), []);
  itemsCache = legacy;
  return legacy;
}

export async function loadItemsAsync(): Promise<WardrobeItem[]> {
  if (typeof window === "undefined") return [];
  try {
    const fromIdb = await idbGet<WardrobeItem[]>(IDB_ITEMS_KEY);
    if (Array.isArray(fromIdb) && fromIdb.length > 0) {
      itemsCache = fromIdb;
      return fromIdb;
    }
  } catch (e) {
    console.warn("IDB load failed", e);
  }
  const legacy = safeParse<WardrobeItem[]>(localStorage.getItem(ITEMS_KEY), []);
  if (legacy.length) {
    try {
      await idbSet(IDB_ITEMS_KEY, legacy);
      try {
        localStorage.removeItem(ITEMS_KEY);
      } catch {
        /* ignore */
      }
    } catch {
      /* keep legacy */
    }
  }
  itemsCache = legacy;
  return legacy;
}

export async function saveItemsAsync(
  items: WardrobeItem[]
): Promise<{ ok: boolean; error?: string }> {
  itemsCache = items;
  try {
    await idbSet(IDB_ITEMS_KEY, items);
    try {
      localStorage.removeItem(ITEMS_KEY);
    } catch {
      /* ignore */
    }
    return { ok: true };
  } catch (e) {
    try {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
      return { ok: true };
    } catch (e2) {
      const msg =
        e2 instanceof DOMException && e2.name === "QuotaExceededError"
          ? "فضای ذخیره‌سازی مرورگر پر است. چند عکس را حذف کن یا فشرده‌تر آپلود کن."
          : "ذخیره کمد ناموفق بود.";
      console.error(msg, e, e2);
      return { ok: false, error: msg };
    }
  }
}

export function saveItems(items: WardrobeItem[]): { ok: boolean; error?: string } {
  itemsCache = items;
  void saveItemsAsync(items);
  return { ok: true };
}

export function loadOutfits(): WardrobeOutfit[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(OUTFITS_KEY), []);
}

export function saveOutfits(outfits: WardrobeOutfit[]): { ok: boolean; error?: string } {
  try {
    localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
    return { ok: true };
  } catch (e) {
    const msg =
      e instanceof DOMException && e.name === "QuotaExceededError"
        ? "فضای ذخیره‌سازی پر است."
        : "ذخیره استایل‌ها ناموفق بود.";
    return { ok: false, error: msg };
  }
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
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function exportWardrobeFullJson(): string {
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      items: loadItems(),
      outfits: loadOutfits(),
      prefs: loadPrefs(),
    },
    null,
    2
  );
}

export function uid() {
  return `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function compressImage(
  file: File,
  maxWidth = 480,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("بارگذاری تصویر ناموفق بود"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas در دسترس نیست"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function compressImageBulk(file: File): Promise<string> {
  return compressImage(file, 360, 0.55);
}

export const WARDROBE_SOFT_LIMIT = 300;

export function estimateStorageMb(items: WardrobeItem[]): number {
  let bytes = 0;
  for (const it of items) {
    bytes += (it.imageData?.length || 0) * 0.75;
    bytes += 200;
  }
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}
