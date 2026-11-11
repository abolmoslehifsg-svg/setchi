"use client";

import { useEffect, useState } from "react";
import {
  CATEGORY_OPTIONS,
  applyCategoryDiscount,
  applyCategoryPriceIncrease,
  clearCategoryDiscount,
  loadCatalog,
} from "@/lib/admin-catalog";
import { ProductCategory } from "@/types";

export default function AdminPricingPage() {
  const [msg, setMsg] = useState("");
  const [discCat, setDiscCat] = useState<ProductCategory | "all">("all");
  const [discPct, setDiscPct] = useState("10");
  const [upCat, setUpCat] = useState<ProductCategory | "all">("all");
  const [upPct, setUpPct] = useState("10");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(loadCatalog().length);
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
    setCount(loadCatalog().length);
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl" dir="rtl">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-bold">تخفیف و قیمت</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          {count} محصول
          {msg ? ` · ${msg}` : ""}
        </p>
      </div>

      <section className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-right">
        <h2 className="font-bold mb-3">تخفیف دسته</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <label className="text-sm flex-1">
            <span className="text-[var(--secondary)] text-xs">دسته</span>
            <select
              value={discCat}
              onChange={(e) => setDiscCat(e.target.value as ProductCategory | "all")}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            >
              <option value="all">همه</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm w-full sm:w-24">
            <span className="text-[var(--secondary)] text-xs">درصد</span>
            <input
              value={discPct}
              onChange={(e) => setDiscPct(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
              dir="ltr"
              inputMode="decimal"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              applyCategoryDiscount(
                discCat,
                parseFloat(discPct.replace(",", ".")) || 0
              );
              flash("تخفیف اعمال شد");
            }}
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
          >
            اعمال تخفیف
          </button>
          <button
            type="button"
            onClick={() => {
              clearCategoryDiscount(discCat);
              flash("تخفیف برداشته شد");
            }}
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm"
          >
            حذف تخفیف
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-right">
        <h2 className="font-bold mb-1">افزایش قیمت</h2>
        <p className="text-xs text-[var(--secondary)] mb-3">
          روی قیمت اصلی اعمال می‌شود؛ اگر تخفیف فعال باشد، نسبت تخفیف حفظ می‌شود.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <label className="text-sm flex-1">
            <span className="text-[var(--secondary)] text-xs">دسته</span>
            <select
              value={upCat}
              onChange={(e) => setUpCat(e.target.value as ProductCategory | "all")}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            >
              <option value="all">همه</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm w-full sm:w-24">
            <span className="text-[var(--secondary)] text-xs">درصد</span>
            <input
              value={upPct}
              onChange={(e) => setUpPct(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
              dir="ltr"
              inputMode="decimal"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              applyCategoryPriceIncrease(
                upCat,
                parseFloat(upPct.replace(",", ".")) || 0
              );
              flash("افزایش اعمال شد");
            }}
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
          >
            اعمال افزایش
          </button>
        </div>
      </section>
    </div>
  );
}
