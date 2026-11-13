"use client";

export type SiteContent = {
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroLead: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  footerTagline: string;
};

export const SITE_CONTENT_KEY = "setchi_site_content_v1";
export const SITE_CONTENT_UPDATED_EVENT = "setchi-site-content-updated";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroEyebrow: "SETCHI · ستچی",
  heroTitleLine1: "لباس‌هایی که داری،",
  heroTitleHighlight: "استایل‌هایی",
  heroTitleLine2: "که هنوز نساختی.",
  heroLead:
    "هسته ستچی کمد هوشمند است: لباس‌هایت را ثبت کن و ترکیب واقعی از همان‌ها بساز. دستیار استایل و گالری مکمل همین مسیرند.",
  aboutEyebrow: "درباره ستچی",
  aboutTitle: "مد مردانه، ساده‌تر و هوشمندتر",
  aboutBody:
    "SETCHI کمک می‌کند از لباس‌هایی که داری بهتر استفاده کنی و ترکیب‌های کاربردی بسازی.",
  footerTagline: "ساخته‌شده برای نسل جدید مد مردانه",
};

export function loadSiteContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return { ...DEFAULT_SITE_CONTENT, ...parsed };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
  try {
    window.dispatchEvent(new Event(SITE_CONTENT_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

export function resetSiteContent() {
  saveSiteContent(DEFAULT_SITE_CONTENT);
  return DEFAULT_SITE_CONTENT;
}
