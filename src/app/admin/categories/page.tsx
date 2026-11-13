"use client";

import { useEffect, useState } from "react";
import {
  CategoryOption,
  addCategory,
  loadCategories,
  removeCategory,
  renameCategory,
  resetCategories,
} from "@/lib/categories";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryOption[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [editValue, setEditValue] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const refresh = () => setItems(loadCategories());

  useEffect(() => {
    refresh();
    const onUp = () => refresh();
    window.addEventListener("setchi-categories-updated", onUp);
    return () => window.removeEventListener("setchi-categories-updated", onUp);
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
          دسته جدید بساز تا در محصولات، تخفیف و فیلتر ویترین دیده شود.
        </p>
        {msg && (
          <p className="mt-2 text-sm text-[var(--success)]">{msg}</p>
        )}
      </div>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="font-bold mb-3">افزودن دسته</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <label className="text-sm flex-1">
            <span className="text-[var(--secondary)] text-xs">نام دسته (فارسی)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً کت و شلوار"
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!name.trim()) return;
                  setItems(addCategory(name));
                  setName("");
                  flash("دسته اضافه شد");
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (!name.trim()) return;
              setItems(addCategory(name));
              setName("");
              flash("دسته اضافه شد");
            }}
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
          >
            افزودن
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h2 className="font-bold">لیست دسته‌ها ({items.length})</h2>
          <button
            type="button"
            onClick={() => {
              if (!confirm("بازگشت به دسته‌های پیش‌فرض؟")) return;
              setItems(resetCategories());
              flash("دسته‌های پیش‌فرض بازیابی شد");
            }}
            className="text-xs text-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            بازیابی پیش‌فرض
          </button>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {items.map((c) => (
            <li
              key={c.value}
              className="flex flex-wrap items-center gap-2 justify-between px-4 py-3 text-sm"
            >
              {editValue === c.value ? (
                <div className="flex flex-1 flex-wrap gap-2 items-center">
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="flex-1 min-w-[8rem] rounded-xl border border-[var(--border)] px-3 py-1.5 text-sm bg-white text-right"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="rounded-full bg-[var(--foreground)] px-3 py-1.5 text-xs text-[var(--background)]"
                    onClick={() => {
                      setItems(renameCategory(c.value, editLabel));
                      setEditValue(null);
                      flash("نام به‌روز شد");
                    }}
                  >
                    ذخیره
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                    onClick={() => setEditValue(null)}
                  >
                    انصراف
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-medium">{c.label}</div>
                    <div className="text-xs text-[var(--secondary)]" dir="ltr">
                      {c.value}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                      onClick={() => {
                        setEditValue(c.value);
                        setEditLabel(c.label);
                      }}
                    >
                      ویرایش نام
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[var(--danger)] text-[var(--danger)] px-3 py-1.5 text-xs"
                      onClick={() => {
                        if (!confirm(`حذف «${c.label}»؟ محصولات این دسته حذف نمی‌شوند.`)) return;
                        setItems(removeCategory(c.value));
                        flash("حذف شد");
                      }}
                    >
                      حذف
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
