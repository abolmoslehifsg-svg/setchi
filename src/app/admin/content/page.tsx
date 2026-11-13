"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  resetSiteContent,
  saveSiteContent,
  type SiteContent,
} from "@/lib/site-content";

export default function AdminContentPage() {
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setC(loadSiteContent());
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2000);
  };

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setC((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="text-right max-w-5xl" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">محتوای سایت</h1>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            متن‌های صفحه اصلی را مثل وردپرس عوض کن و همان‌جا پیش‌نمایش ببین.
          </p>
          {msg && <p className="mt-2 text-sm text-[var(--success)]">{msg}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            onClick={() => {
              setC(resetSiteContent());
              flash("بازگشت به پیش‌فرض");
            }}
          >
            بازنشانی
          </button>
          <button
            type="button"
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
            onClick={() => {
              saveSiteContent(c);
              flash("ذخیره شد — در سایت (همین مرورگر) دیده می‌شود");
            }}
          >
            ذخیره
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="font-bold">هیرو</h2>
          {(
            [
              ["heroEyebrow", "خط بالای عنوان"],
              ["heroTitleLine1", "عنوان — خط ۱"],
              ["heroTitleHighlight", "کلمه هایلایت"],
              ["heroTitleLine2", "عنوان — خط ۲"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="text-xs text-[var(--secondary)]">{label}</span>
              <input
                value={c[key]}
                onChange={(e) => set(key, e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
              />
            </label>
          ))}
          <label className="block text-sm">
            <span className="text-xs text-[var(--secondary)]">متن معرفی</span>
            <textarea
              value={c.heroLead}
              onChange={(e) => set("heroLead", e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            />
          </label>

          <h2 className="font-bold pt-2">درباره</h2>
          <label className="block text-sm">
            <span className="text-xs text-[var(--secondary)]">برچسب</span>
            <input
              value={c.aboutEyebrow}
              onChange={(e) => set("aboutEyebrow", e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-[var(--secondary)]">عنوان</span>
            <input
              value={c.aboutTitle}
              onChange={(e) => set("aboutTitle", e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-[var(--secondary)]">متن</span>
            <textarea
              value={c.aboutBody}
              onChange={(e) => set("aboutBody", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-[var(--secondary)]">تگ‌لاین فوتر</span>
            <input
              value={c.footerTagline}
              onChange={(e) => set("footerTagline", e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-5">
          <p className="text-xs text-[var(--secondary)] mb-4">پیش‌نمایش زنده</p>
          <p className="eyebrow text-sm mb-3">{c.heroEyebrow}</p>
          <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
            {c.heroTitleLine1}
            <br />
            <mark className="hero-mark">{c.heroTitleHighlight}</mark> {c.heroTitleLine2}
          </h2>
          <p className="mt-4 text-[var(--secondary)] leading-relaxed text-sm">{c.heroLead}</p>
          <hr className="my-6 border-[var(--border)]" />
          <p className="eyebrow text-sm mb-2">{c.aboutEyebrow}</p>
          <h3 className="text-xl font-bold">{c.aboutTitle}</h3>
          <p className="mt-2 text-sm text-[var(--secondary)]">{c.aboutBody}</p>
          <p className="mt-6 text-xs text-[var(--secondary)]">{c.footerTagline}</p>
        </div>
      </div>
    </div>
  );
}
