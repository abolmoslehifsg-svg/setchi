"use client";

import { useEffect, useState } from "react";
import { compressImage } from "@/lib/image";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  resetSiteContent,
  saveSiteContent,
  type HomeCategory,
  type HomeStep,
  type SiteContent,
} from "@/lib/site-content";

type Tab = "hero" | "steps" | "cats" | "about" | "footer" | "theme";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "هیرو و برند" },
  { id: "steps", label: "مراحل" },
  { id: "cats", label: "کارت‌های دسته" },
  { id: "about", label: "درباره" },
  { id: "footer", label: "فوتر" },
  { id: "theme", label: "رنگ‌ها" },
];

export default function AdminContentPage() {
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [tab, setTab] = useState<Tab>("hero");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setC(loadSiteContent());
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2200);
  };

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setC((prev) => ({ ...prev, [key]: value }));

  const upload = async (file: File | null, apply: (dataUrl: string) => void) => {
    if (!file) return;
    try {
      const data = await compressImage(file, 1200, 0.78);
      apply(data);
      flash("عکس اضافه شد");
    } catch {
      flash("خطا در فشرده‌سازی عکس");
    }
  };

  const field = (
    label: string,
    key: keyof SiteContent,
    opts?: { multiline?: boolean; dir?: string }
  ) => (
    <label className="block text-sm">
      <span className="text-xs text-[var(--secondary)]">{label}</span>
      {opts?.multiline ? (
        <textarea
          value={String(c[key] ?? "")}
          onChange={(e) => set(key, e.target.value as never)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
          dir={opts.dir}
        />
      ) : (
        <input
          value={String(c[key] ?? "")}
          onChange={(e) => set(key, e.target.value as never)}
          className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
          dir={opts?.dir}
        />
      )}
    </label>
  );

  return (
    <div className="text-right max-w-5xl" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">محتوای کامل سایت</h1>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            متن، عکس، دکمه، بخش‌ها، فوتر و رنگ — همه از اینجا.
          </p>
          {msg && <p className="mt-2 text-sm text-[var(--success)]">{msg}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            onClick={() => {
              if (!confirm("بازگشت به پیش‌فرض؟")) return;
              setC(resetSiteContent());
              flash("بازنشانی شد");
            }}
          >
            بازنشانی
          </button>
          <button
            type="button"
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
            onClick={() => {
              saveSiteContent(c);
              flash("ذخیره شد — در سایت همین مرورگر اعمال می‌شود");
            }}
          >
            ذخیره همه
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              tab === t.id
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)] hover:bg-[var(--border)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
        {tab === "hero" && (
          <>
            <h2 className="font-bold">برند و هیرو</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {field("نام برند (EN)", "brandName", { dir: "ltr" })}
              {field("نام فارسی", "brandNameFa")}
            </div>
            {field("خط بالای عنوان", "heroEyebrow")}
            {field("عنوان — خط ۱", "heroTitleLine1")}
            {field("کلمه هایلایت", "heroTitleHighlight")}
            {field("عنوان — خط ۲", "heroTitleLine2")}
            {field("متن معرفی", "heroLead", { multiline: true })}
            <div className="grid sm:grid-cols-2 gap-3">
              {field("دکمه اصلی — متن", "ctaPrimaryLabel")}
              {field("دکمه اصلی — لینک", "ctaPrimaryHref", { dir: "ltr" })}
              {field("دکمه دوم — متن", "ctaSecondaryLabel")}
              {field("دکمه دوم — لینک", "ctaSecondaryHref", { dir: "ltr" })}
            </div>
            <label className="block text-sm">
              <span className="text-xs text-[var(--secondary)]">عکس هیرو</span>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) =>
                  upload(e.target.files?.[0] || null, (d) => set("heroImage", d))
                }
              />
            </label>
            {c.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.heroImage} alt="" className="mt-2 h-40 rounded-xl object-cover" />
            )}
            {field("یا آدرس عکس هیرو", "heroImage", { dir: "ltr" })}
            {field("عنوان بخش منتخب", "featuredTitle")}
            {field("زیرعنوان منتخب", "featuredSubtitle")}
            {field("عنوان محبوب", "popularTitle")}
            {field("زیرعنوان محبوب", "popularSubtitle")}
          </>
        )}

        {tab === "steps" && (
          <>
            <h2 className="font-bold">بخش «چطور کار می‌کنه»</h2>
            {field("عنوان", "stepsTitle")}
            {field("زیرعنوان", "stepsSubtitle")}
            {c.steps.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border)] p-3 space-y-2 bg-[var(--muted)]/30"
              >
                <p className="text-xs text-[var(--secondary)]">مرحله {i + 1}</p>
                <input
                  value={s.num}
                  onChange={(e) => {
                    const steps = [...c.steps] as HomeStep[];
                    steps[i] = { ...steps[i], num: e.target.value };
                    set("steps", steps);
                  }}
                  placeholder="شماره"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                />
                <input
                  value={s.title}
                  onChange={(e) => {
                    const steps = [...c.steps] as HomeStep[];
                    steps[i] = { ...steps[i], title: e.target.value };
                    set("steps", steps);
                  }}
                  placeholder="عنوان"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                />
                <textarea
                  value={s.desc}
                  onChange={(e) => {
                    const steps = [...c.steps] as HomeStep[];
                    steps[i] = { ...steps[i], desc: e.target.value };
                    set("steps", steps);
                  }}
                  placeholder="توضیح"
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                />
              </div>
            ))}
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
              onClick={() =>
                set("steps", [
                  ...c.steps,
                  { num: String(c.steps.length + 1).padStart(2, "0"), title: "", desc: "" },
                ])
              }
            >
              + مرحله
            </button>
          </>
        )}

        {tab === "cats" && (
          <>
            <h2 className="font-bold">کارت‌های دسته‌بندی صفحه اصلی</h2>
            {field("عنوان بخش", "categoriesTitle")}
            {field("زیرعنوان", "categoriesSubtitle")}
            {c.categories.map((cat, i) => (
              <div
                key={cat.id + i}
                className="rounded-xl border border-[var(--border)] p-3 space-y-2 bg-[var(--muted)]/30"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs text-[var(--secondary)]">کارت {i + 1}</p>
                  <button
                    type="button"
                    className="text-xs text-[var(--danger)]"
                    onClick={() =>
                      set(
                        "categories",
                        c.categories.filter((_, j) => j !== i)
                      )
                    }
                  >
                    حذف
                  </button>
                </div>
                <input
                  value={cat.title}
                  onChange={(e) => {
                    const categories = [...c.categories] as HomeCategory[];
                    categories[i] = { ...categories[i], title: e.target.value };
                    set("categories", categories);
                  }}
                  placeholder="عنوان"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                />
                <input
                  value={cat.desc}
                  onChange={(e) => {
                    const categories = [...c.categories] as HomeCategory[];
                    categories[i] = { ...categories[i], desc: e.target.value };
                    set("categories", categories);
                  }}
                  placeholder="توضیح کوتاه"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                />
                <input
                  value={cat.href}
                  onChange={(e) => {
                    const categories = [...c.categories] as HomeCategory[];
                    categories[i] = { ...categories[i], href: e.target.value };
                    set("categories", categories);
                  }}
                  placeholder="لینک"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                  dir="ltr"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm"
                  onChange={(e) =>
                    upload(e.target.files?.[0] || null, (d) => {
                      const categories = [...c.categories] as HomeCategory[];
                      categories[i] = { ...categories[i], image: d };
                      set("categories", categories);
                    })
                  }
                />
                {cat.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt="" className="h-24 rounded-lg object-cover" />
                )}
              </div>
            ))}
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
              onClick={() =>
                set("categories", [
                  ...c.categories,
                  {
                    id: `c_${Date.now()}`,
                    title: "دسته جدید",
                    desc: "",
                    image:
                      "https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=600&q=80",
                    href: "/outfits/",
                  },
                ])
              }
            >
              + کارت دسته
            </button>
          </>
        )}

        {tab === "about" && (
          <>
            <h2 className="font-bold">بلوک درباره در صفحه اصلی</h2>
            {field("برچسب", "aboutEyebrow")}
            {field("عنوان", "aboutTitle")}
            {field("متن", "aboutBody", { multiline: true })}
            {field("متن دکمه", "aboutCtaLabel")}
            {field("لینک دکمه", "aboutCtaHref", { dir: "ltr" })}
            <label className="block text-sm">
              <span className="text-xs text-[var(--secondary)]">عکس درباره</span>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) =>
                  upload(e.target.files?.[0] || null, (d) => set("aboutImage", d))
                }
              />
            </label>
            {c.aboutImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.aboutImage} alt="" className="h-40 rounded-xl object-cover" />
            )}
            {field("یا آدرس عکس", "aboutImage", { dir: "ltr" })}
          </>
        )}

        {tab === "footer" && (
          <>
            <h2 className="font-bold">فوتر</h2>
            {field("متن معرفی کوتاه", "footerBlurb", { multiline: true })}
            {field("تگ‌لاین پایین", "footerTagline")}
            {field("لینک تلگرام", "telegramUrl", { dir: "ltr" })}
            {field("برچسب تلگرام", "telegramLabel")}
          </>
        )}

        {tab === "theme" && (
          <>
            <h2 className="font-bold">رنگ‌های تم (اختیاری)</h2>
            <p className="text-xs text-[var(--secondary)] mb-2">
              خالی بگذار تا رنگ پیش‌فرض فصلی/تم بماند. مثال: #172B2A
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {field("پس‌زمینه --background", "colorBackground", { dir: "ltr" })}
              {field("متن --foreground", "colorForeground", { dir: "ltr" })}
              {field("اکسنت --accent", "colorAccent", { dir: "ltr" })}
              {field("اصلی/فوتر --primary", "colorPrimary", { dir: "ltr" })}
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-[11px] text-[var(--secondary)] leading-relaxed">
        محصولات، استایل‌ها، دسته‌بندی فروش و قیمت از منوهای جداگانه ادمین مدیریت
        می‌شوند. این صفحه ظاهر و متن‌های عمومی سایت را کنترل می‌کند.
      </p>
    </div>
  );
}
