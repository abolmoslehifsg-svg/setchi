"use client";

import { useEffect, useState } from "react";
import {
  Category,
  addCategory,
  getAllCategories,
  removeCategory,
} from "@/lib/categories";
import { CATEGORIES_UPDATED_EVENT } from "@/lib/catalog-storage";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = () => setItems(getAllCategories());

  useEffect(() => {
    refresh();
    const onUp = () => refresh();
    window.addEventListener(CATEGORIES_UPDATED_EVENT, onUp);
    return () => window.removeEventListener(CATEGORIES_UPDATED_EVENT, onUp);
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    window.setTimeout(() => setMsg(""), 2200);
  };

  return (
    <div className="text-right" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">دسته‌بندی‌ها</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          دسته جدید بساز تا در محصولات و تخفیف دیده شود.
        </p>
        {msg && <p className="mt-2 text-sm text-[var(--success)]">{msg}</p>}
      </div>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="font-bold mb-3">افزودن دسته</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <label className="text-sm flex-1">
            <span className="text-[var(--secondary)] text-xs">نام دسته</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً کت و شلوار"
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const r = addCategory(name);
                  if (r.error) flash(r.error);
                  else {
                    setName("");
                    refresh();
                    flash(r.created ? "دسته اضافه شد" : "از قبل وجود داشت");
                  }
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              const r = addCategory(name);
              if (r.error) flash(r.error);
              else {
                setName("");
                refresh();
                flash(r.created ? "دسته اضافه شد" : "از قبل وجود داشت");
              }
            }}
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
          >
            افزودن
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h2 className="font-bold">لیست دسته‌ها ({items.length})</h2>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {items.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-2 justify-between px-4 py-3 text-sm"
            >
              <div>
                <div className="font-medium">{c.label}</div>
                <div className="text-xs text-[var(--secondary)]" dir="ltr">
                  {c.id}
                  {!c.custom && " · پیش‌فرض"}
                </div>
              </div>
              {c.custom && (
                <button
                  type="button"
                  className="rounded-full border border-[var(--danger)] text-[var(--danger)] px-3 py-1.5 text-xs"
                  onClick={() => {
                    if (!confirm(`حذف «${c.label}»؟`)) return;
                    removeCategory(c.id);
                    refresh();
                    flash("حذف شد");
                  }}
                >
                  حذف
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
