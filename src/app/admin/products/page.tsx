"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/data/products";
import {
  CatalogProduct,
  CATEGORY_OPTIONS,
  addProduct,
  importCsvMerge,
  loadCatalog,
  removeProduct,
  resetCatalogToBase,
  sellOne,
  updateProduct,
} from "@/lib/admin-catalog";
import {
  PriceChangeRecord,
  clearPriceChanges,
  getPriceChanges,
} from "@/lib/admin-stats";
import { ProductCategory } from "@/types";
import { loadCategories } from "@/lib/categories";

const SOURCE_LABEL: Record<PriceChangeRecord["source"], string> = {
  manual: "دستی",
  discount: "تخفیف",
  increase: "افزایش",
  "clear-discount": "حذف تخفیف",
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [nameFa, setNameFa] = useState("");
  const [category, setCategory] = useState<ProductCategory>("oversized-tshirt");
  const [catOptions, setCatOptions] = useState(CATEGORY_OPTIONS);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [history, setHistory] = useState<PriceChangeRecord[]>([]);

  const refreshHistory = () => setHistory(getPriceChanges(40));

  useEffect(() => {
    setItems(loadCatalog());
    setCatOptions(loadCategories());
    refreshHistory();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (p) =>
        p.nameFa.toLowerCase().includes(s) ||
        p.name.toLowerCase().includes(s) ||
        p.category.includes(s) ||
        p.id.includes(s)
    );
  }, [items, q]);

  const totalStock = items.reduce((a, p) => a + p.stock, 0);
  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  const onAdd = () => {
    if (!nameFa.trim()) {
      flash("نام لازم است");
      return;
    }
    const p = parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
    const st = parseInt(stock.replace(/[^\d]/g, ""), 10) || 0;
    setItems(
      addProduct({
        name: nameFa.trim(),
        nameFa: nameFa.trim(),
        description: "",
        descriptionFa: "",
        category,
        price: p,
        stock: st,
        sizes: ["M", "L", "XL"],
        colors: ["Black"],
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        ],
        tags: [],
      })
    );
    setNameFa("");
    setPrice("");
    setStock("10");
    flash("اضافه شد");
  };

  const onImportFile = async (file: File | null) => {
    if (!file) return;
    const before = loadCatalog().length;
    const text = await file.text();
    const next = importCsvMerge(text);
    setItems(next);
    flash(`${Math.max(0, next.length - before)} ردیف`);
  };

  const fmtTime = (t: number) =>
    new Date(t).toLocaleString("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="px-4 sm:px-6 py-8 max-w-6xl" dir="rtl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-right">
        <div>
          <h1 className="text-2xl font-bold">محصولات و انبار</h1>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            {items.length} محصول · انبار: {totalStock}
            {msg ? ` · ${msg}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("بازنشانی کاتالوگ؟")) {
              setItems(resetCatalogToBase());
              flash("بازنشانی شد");
            }
          }}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm self-start"
        >
          بازنشانی
        </button>
      </div>

      <section className="mb-4 grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right">
          <h2 className="font-bold mb-3">افزودن</h2>
          <div className="space-y-2">
            <input
              value={nameFa}
              onChange={(e) => setNameFa(e.target.value)}
              placeholder="نام"
              className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            >
              {catOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="قیمت"
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
                dir="ltr"
                inputMode="numeric"
              />
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="انبار"
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
                dir="ltr"
                inputMode="numeric"
              />
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="w-full rounded-full bg-[var(--foreground)] py-2.5 text-sm text-[var(--background)]"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right">
          <h2 className="font-bold mb-3">ورود از اکسل</h2>
          <p className="text-xs text-[var(--secondary)] mb-3">
            CSV UTF-8 · nameFa, category, price, stock
          </p>
          <input
            type="file"
            accept=".csv,text/csv,.txt"
            onChange={(e) => onImportFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
        </div>
      </section>

      <div className="mb-3 flex flex-wrap items-center gap-3 justify-between">
        <h2 className="font-bold text-right">لیست</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو..."
          className="w-full max-w-xs rounded-full border border-[var(--border)] px-4 py-1.5 text-sm bg-white text-right"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] mb-8">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="text-right px-3 py-3 font-medium">نام</th>
              <th className="text-right px-3 py-3 font-medium">دسته</th>
              <th className="text-right px-3 py-3 font-medium">قیمت</th>
              <th className="text-right px-3 py-3 font-medium">انبار</th>
              <th className="text-right px-3 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2.5 font-medium text-right">{p.nameFa}</td>
                <td className="px-3 py-2.5 text-[var(--secondary)] text-right">
                  {catOptions.find((c) => c.value === p.category)?.label ||
                    p.category}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <input
                    type="text"
                    dir="ltr"
                    defaultValue={String(p.price)}
                    key={`${p.id}-${p.price}`}
                    onBlur={(e) => {
                      const v =
                        parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0;
                      if (v !== p.price) {
                        setItems(updateProduct(p.id, { price: v }));
                        refreshHistory();
                        const delta = v - p.price;
                        const sign = delta > 0 ? "+" : "";
                        flash(
                          `${formatPrice(p.price)} → ${formatPrice(v)} (${sign}${formatPrice(Math.abs(delta))})`
                        );
                      }
                    }}
                    className="w-28 rounded-lg border border-[var(--border)] px-2 py-1 text-sm bg-white"
                  />
                  {p.originalPrice != null && p.originalPrice !== p.price && (
                    <span className="block text-[10px] text-[var(--secondary)] line-through mt-0.5">
                      {formatPrice(p.originalPrice)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <input
                    type="text"
                    dir="ltr"
                    defaultValue={String(p.stock)}
                    key={`${p.id}-s-${p.stock}`}
                    onBlur={(e) => {
                      const v =
                        parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0;
                      if (v !== p.stock) {
                        setItems(updateProduct(p.id, { stock: v }));
                        flash("انبار ذخیره شد");
                      }
                    }}
                    className="w-16 rounded-lg border border-[var(--border)] px-2 py-1 text-sm bg-white"
                  />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex flex-wrap gap-1 justify-start">
                    <button
                      type="button"
                      disabled={p.stock <= 0}
                      onClick={() => {
                        setItems(sellOne(p.id));
                        flash("فروش (−۱)");
                      }}
                      className="text-xs rounded-full border border-[var(--border)] px-2.5 py-1 disabled:opacity-40"
                    >
                      فروش ۱
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`حذف «${p.nameFa}»؟`)) {
                          setItems(removeProduct(p.id));
                          flash("حذف شد");
                        }
                      }}
                      className="text-xs rounded-full text-red-600 border border-red-200 px-2.5 py-1"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-right">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold">تاریخچه تغییر قیمت</h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("پاک کردن تاریخچه؟")) {
                  clearPriceChanges();
                  refreshHistory();
                }
              }}
              className="text-xs text-[var(--secondary)] hover:text-red-600"
            >
              پاک کردن
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--secondary)]">
            هنوز تغییری ثبت نشده. با ویرایش قیمت در جدول یا اعمال تخفیف/افزایش اینجا پر می‌شود.
          </p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {history.map((h) => {
              const up = h.delta > 0;
              return (
                <li
                  key={h.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm border-b border-[var(--border)] pb-2 last:border-0"
                >
                  <div>
                    <span className="font-medium">{h.nameFa}</span>
                    <span className="text-[var(--secondary)] text-xs mr-2">
                      · {SOURCE_LABEL[h.source]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 tabular-nums text-xs sm:text-sm">
                    <span className="text-[var(--secondary)]">{formatPrice(h.from)}</span>
                    <span>→</span>
                    <span className="font-medium">{formatPrice(h.to)}</span>
                    <span className={up ? "text-emerald-600" : "text-red-600"}>
                      ({up ? "+" : "−"}
                      {formatPrice(Math.abs(h.delta))})
                    </span>
                    <span className="text-[var(--secondary)]">{fmtTime(h.at)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
