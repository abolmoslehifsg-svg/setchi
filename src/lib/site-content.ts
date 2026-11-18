"use client";

import { applyFonts } from "@/lib/fonts";

export type HomeStep = { num: string; title: string; desc: string };
export type HomeCategory = {
  id: string;
  title: string;
  desc: string;
  image: string;
  href: string;
};

export type SiteContent = {
  brandName: string;
  brandNameFa: string;

  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroLead: string;
  heroImage: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  featuredTitle: string;
  featuredSubtitle: string;

  stepsTitle: string;
  stepsSubtitle: string;
  steps: HomeStep[];

  categoriesTitle: string;
  categoriesSubtitle: string;
  categories: HomeCategory[];

  popularTitle: string;
  popularSubtitle: string;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  aboutCtaLabel: string;
  aboutCtaHref: string;

  footerBlurb: string;
  footerTagline: string;
  telegramUrl: string;
  telegramLabel: string;

  colorBackground: string;
  colorForeground: string;
  colorAccent: string;
  colorPrimary: string;

  bodyFontId: string;
  displayFontId: string;
};

export const SITE_CONTENT_KEY = "setchi_site_content_v2";
export const SITE_CONTENT_UPDATED_EVENT = "setchi-site-content-updated";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brandName: "SETCHI",
  brandNameFa: "ستچی",

  heroEyebrow: "SETCHI · ستچی",
  heroTitleLine1: "لباس‌هایی که داری،",
  heroTitleHighlight: "استایل‌هایی",
  heroTitleLine2: "که هنوز نساختی.",
  heroLead:
    "هسته ستچی کمد هوشمند است: لباس‌هایت را ثبت کن و ترکیب واقعی از همان‌ها بساز. دستیار استایل و گالری مکمل همین مسیرند.",
  heroImage:
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80",
  ctaPrimaryLabel: "شروع با کمد من",
  ctaPrimaryHref: "/wardrobe/",
  ctaSecondaryLabel: "دستیار استایل",
  ctaSecondaryHref: "/style-assistant/",

  featuredTitle: "استایل‌های منتخب",
  featuredSubtitle: "الهام از گالری — مکمل کمد هوشمند",

  stepsTitle: "ستچی چطور کار می‌کنه؟",
  stepsSubtitle: "مسیر واقعی استفاده از کمد هوشمند",
  steps: [
    {
      num: "۰۱",
      title: "لباس‌هات را ثبت کن",
      desc: "عکس و مشخصات لباس‌های موجود در کمدت را اضافه کن — رنگ، سبک و فصل.",
    },
    {
      num: "۰۲",
      title: "ترکیب بساز",
      desc: "از همان لباس‌ها، ستچی ترکیب‌های هماهنگ برای موقعیت و فصل انتخابی‌ات می‌سازد.",
    },
    {
      num: "۰۳",
      title: "کمبودها را ببین",
      desc: "اگر قطعه‌ای کم داری مشخص می‌شود؛ در صورت نیاز از گالری یا دستیار الهام بگیر.",
    },
  ],

  categoriesTitle: "دسته‌بندی استایل",
  categoriesSubtitle: "مسیرهای مختلف برای شروع",
  categories: [
    {
      id: "streetwear",
      title: "استریت‌ویر",
      desc: "جسارت و راحتی شهری",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
      href: "/outfits/",
    },
    {
      id: "minimalist",
      title: "مینیمال",
      desc: "سادگی با کیفیت بالا",
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=600&q=80",
      href: "/outfits/",
    },
    {
      id: "sporty",
      title: "اسپرتی",
      desc: "انرژی و حرکت",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      href: "/outfits/",
    },
    {
      id: "casual",
      title: "کژوال",
      desc: "روزمره و همه‌کاره",
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
      href: "/outfits/",
    },
  ],

  popularTitle: "ترکیب‌های محبوب",
  popularSubtitle: "از گالری — قیمت‌ها از مجموع اجزا",

  aboutEyebrow: "درباره ستچی",
  aboutTitle: "مد مردانه، ساده‌تر و هوشمندتر",
  aboutBody:
    "SETCHI کمک می‌کند از لباس‌هایی که داری بهتر استفاده کنی و ترکیب‌های کاربردی بسازی.",
  aboutImage:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  aboutCtaLabel: "شروع با کمد من",
  aboutCtaHref: "/wardrobe/",

  footerBlurb: "پلتفرم استایل‌دهی مردانه. استایلت رو پیدا کن، ترکیب کن و بدرخش.",
  footerTagline: "ساخته‌شده برای نسل جدید مد مردانه",
  telegramUrl: "https://t.me/tenmanogod",
  telegramLabel: "تلگرام @tenmanogod",

  colorBackground: "",
  colorForeground: "",
  colorAccent: "",
  colorPrimary: "",

  bodyFontId: "vazirmatn",
  displayFontId: "fraunces",
};

export function loadSiteContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    const raw =
      localStorage.getItem(SITE_CONTENT_KEY) ||
      localStorage.getItem("setchi_site_content_v1");
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      steps: parsed.steps?.length ? parsed.steps : DEFAULT_SITE_CONTENT.steps,
      categories: parsed.categories?.length
        ? parsed.categories
        : DEFAULT_SITE_CONTENT.categories,
    };
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

export function applySiteTheme(c: SiteContent) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const map: [string, string][] = [
    ["--background", c.colorBackground],
    ["--foreground", c.colorForeground],
    ["--accent", c.colorAccent],
    ["--primary", c.colorPrimary],
  ];
  for (const [varName, val] of map) {
    if (val && val.trim()) root.style.setProperty(varName, val.trim());
    else root.style.removeProperty(varName);
  }
  applyFonts(c.bodyFontId || "vazirmatn", c.displayFontId || "fraunces");
}
