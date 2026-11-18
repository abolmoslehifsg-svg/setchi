"use client";

import { useEffect, useState } from "react";
import {
  addCustomFont,
  allFontOptions,
  loadCustomFonts,
  removeCustomFont,
  type CustomFont,
} from "@/lib/fonts";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  saveSiteContent,
  type SiteContent,
} from "@/lib/site-content";

export default function AdminFontsPage() {
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [customs, setCustoms] = useState<CustomFont[]>([]);
  const [msg, setMsg] = useState("");
  const [opts, setOpts] = useState(allFontOptions());

  const refresh = () => {
    setC(loadSiteContent());
    setCustoms(loadCustomFonts());
    setOpts(allFontOptions());
  };

  useEffect(() => {
    refresh();
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2200);
  };

  const save = (next: SiteContent) => {
    setC(next);
    saveSiteContent(next);
    flash("ذخیره شد");
  };

  return (
    <div className="max-w-2xl space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">فونت‌ها</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          فونت‌های پیش‌فرض محلی/پایدار هستند. می‌توانی فونت جدید (.woff2/.ttf) اضافه کنی؛ در لیست می‌مانند تا وقتی حذفشان کنی.
        </p>
      </div>
      {msg && (
        <p className="rounded-lg bg-[var(--success-soft)] px-3 py-2 text-sm text-[var(--success)]">{msg}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <label className="text-sm space-y-1 block">
          فونت متن (بدنه)
          <select
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            value={c.bodyFontId || "vazirmatn"}
            onChange={(e) => save({ ...c, bodyFontId: e.target.value })}
          >
            {opts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm space-y-1 block">
          فونت نمایشی (برند / تیتر)
          <select
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            value={c.displayFontId || "fraunces"}
            onChange={(e) => save({ ...c, displayFontId: e.target.value })}
          >
            {opts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <p className="sm:col-span-2 text-sm p-3 rounded-xl bg-[var(--muted)]" style={{ fontFamily: "var(--font-vazir)" }}>
          نمونه بدنه: ستچی — استایلت رو پیدا کن
        </p>
        <p className="sm:col-span-2 text-lg font-bold p-3 rounded-xl bg-[var(--muted)]" style={{ fontFamily: "var(--font-display)" }}>
          نمونه تیتر SETCHI
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
        <h2 className="font-bold text-sm">نصب فونت سفارشی</h2>
        <input
          type="file"
          accept=".woff2,.woff,.ttf,.otf,font/woff2,font/ttf"
          className="block w-full text-xs"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 1_500_000) {
              flash("حجم بیش از ۱.۵ مگابایت است");
              return;
            }
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const r = new FileReader();
              r.onload = () => resolve(String(r.result));
              r.onerror = reject;
              r.readAsDataURL(file);
            });
            const base = file.name.replace(/\.[^.]+$/, "");
            const id = `custom_${Date.now().toString(36)}`;
            const familyName = base.replace(/[^a-zA-Z0-9_-]/g, "") || id;
            addCustomFont({ id, label: base, familyName, dataUrl, weight: 400 });
            refresh();
            flash("فونت اضافه شد");
            e.target.value = "";
          }}
        />
        <ul className="text-sm space-y-2">
          {customs.map((f) => (
            <li key={f.id} className="flex justify-between gap-2">
              <span>{f.label}</span>
              <button
                type="button"
                className="text-xs text-[var(--danger)]"
                onClick={() => {
                  removeCustomFont(f.id);
                  refresh();
                  flash("حذف شد");
                }}
              >
                حذف
              </button>
            </li>
          ))}
          {customs.length === 0 && (
            <li className="text-[var(--secondary)] text-xs">هنوز فونت سفارشی نیست.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
