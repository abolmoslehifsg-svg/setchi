"use client";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  kind: "builtin" | "system" | "custom";
};

export const BUILTIN_FONTS: FontOption[] = [
  {
    id: "vazirmatn",
    label: "وزیرمتن (آفلاین)",
    family: "'Vazirmatn', Tahoma, system-ui, sans-serif",
    kind: "builtin",
  },
  {
    id: "fraunces",
    label: "Fraunces (نمایشی)",
    family: "'Fraunces', Georgia, 'Times New Roman', serif",
    kind: "builtin",
  },
  {
    id: "tahoma",
    label: "تاهوما (سیستم)",
    family: "Tahoma, Arial, sans-serif",
    kind: "system",
  },
  {
    id: "system",
    label: "سیستم پیش‌فرض",
    family: "system-ui, -apple-system, Tahoma, sans-serif",
    kind: "system",
  },
];

export type CustomFont = {
  id: string;
  label: string;
  familyName: string;
  dataUrl: string;
  weight?: number;
};

const CUSTOM_KEY = "setchi_custom_fonts_v1";
export const FONTS_UPDATED_EVENT = "setchi-fonts-updated";

function notify() {
  try {
    window.dispatchEvent(new Event(FONTS_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

export function loadCustomFonts(): CustomFont[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomFont[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomFonts(list: CustomFont[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  notify();
}

export function addCustomFont(font: CustomFont) {
  const list = loadCustomFonts().filter((f) => f.id !== font.id);
  list.push(font);
  saveCustomFonts(list);
  injectCustomFontFaces(list);
}

export function removeCustomFont(id: string) {
  const list = loadCustomFonts().filter((f) => f.id !== id);
  saveCustomFonts(list);
  injectCustomFontFaces(list);
}

export function allFontOptions(): FontOption[] {
  const customs = loadCustomFonts().map((f) => ({
    id: f.id,
    label: `${f.label} (سفارشی)`,
    family: `'${f.familyName}', Tahoma, sans-serif`,
    kind: "custom" as const,
  }));
  return [...BUILTIN_FONTS, ...customs];
}

export function resolveFontFamily(id: string | undefined, fallbackId: string): string {
  const list = allFontOptions();
  const found = list.find((f) => f.id === id) || list.find((f) => f.id === fallbackId);
  return found?.family || BUILTIN_FONTS[0].family;
}

const STYLE_ID = "setchi-custom-fonts";

export function injectCustomFontFaces(list?: CustomFont[]) {
  if (typeof document === "undefined") return;
  const fonts = list ?? loadCustomFonts();
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = fonts
    .map(
      (f) =>
        `@font-face{font-family:'${f.familyName}';font-style:normal;font-weight:${
          f.weight || 400
        };font-display:swap;src:url(${f.dataUrl}) format('woff2'),url(${f.dataUrl})}`
    )
    .join("\n");
}

export function applyFonts(bodyId: string, displayId: string) {
  if (typeof document === "undefined") return;
  injectCustomFontFaces();
  const root = document.documentElement;
  root.style.setProperty("--font-vazir", resolveFontFamily(bodyId, "vazirmatn"));
  root.style.setProperty("--font-fraunces", resolveFontFamily(displayId, "fraunces"));
  root.style.setProperty("--font-display", resolveFontFamily(displayId, "fraunces"));
}
