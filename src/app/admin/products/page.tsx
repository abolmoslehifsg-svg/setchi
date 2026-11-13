"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/data/products";
import {
  CatalogProduct,
  FALLBACK_IMAGE,
  addProduct,
  hasRealImage,
  importCsvMerge,
  loadCatalog,
  publishIssues,
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
import { Category, getAllCategories } from "@/lib/categories";
import { CATEGORIES_UPDATED_EVENT } from "@/lib/catalog-storage";
import { compressImage } from "@/lib/image";
import { parseIntLoose } from "@/lib/numbers";
import { ProductCategory, ProductStatus } from "@/types";

const SOURCE_LABEL: Record<PriceChangeRecord["source"], string> = {
  manual: "دستی",
  discount: "تخفیف",
  increase: "افزایش",
  "clear-discount": "حذف تخفیف",
};

const STATUS_LABEL: Record<ProductStatus, string> = {
  draft: "پیش‌نویس",
  open: "باز",
  closed: "بسته",
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [nameFa, setNameFa] = useState("");
  const [category, setCategory] = useState<ProductCategory>("oversized-tshirt");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [images, setImages] = useState<string[]>([]);
  const [history, setHistory] = useState<PriceChangeRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");

  const refreshHistory = () => setHistory(getPriceChanges(40));
  const refreshCats = () => setCats(getAllCategories());

  useEffect(() => {
    setItems(loadCatalog());
    refreshCats();
    refreshHistory();
    const onCat = () => refreshCats();
    window.addEventListener(CATEGORIES_UPDATED_EVENT, onCat);
    return () => window.removeEventListener(CATEGORIES_UPDATED_EVENT, onCat);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((p) => {
      if (statusFilter !== "all" && (p.status ?? "open") !== statusFilter) return false;
      if (!s) return true;
      return (
        p.nameFa.toLowerCase().includes(s) ||
        p.name.toLowerCase().includes(s) ||
        p.category.includes(s) ||
        p.id.includes(s)
      );
    });
  }, [items, q, statusFilter]);

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
    setItems(
      addProduct({
        name: nameFa.trim(),
        nameFa: nameFa.trim(),
        description: "",
        descriptionFa: "",
        category,
        price: parseIntLoose(price),
        stock: parseIntLoose(stock, 10),
        sizes: ["M", "L", "XL"],
        colors: ["Black"],
        images: images.length ? images : [FALLBACK_IMAGE],
        tags: [],
        status: "draft",
      })
    );
    setNameFa("");
    setPrice("");
    setStock("10");
    setImages([]);
    flash("به‌عنوان پیش‌نویس اضافه شد");
  };

  const onImages = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const data = await Promise.all(
        Array.from(files).slice(0, 4).map((f) => compressImage(f, 720, 0.7))
      );
      setImages((prev) => [...prev, ...data].slice(0, 6));
      flash("عکس اضافه شد");
    } catch {
      flash("خطا در فشرده‌سازی عکس");
    }
  };

  const changeStatus = (p: CatalogProduct, next: ProductStatus) => {
    if (next === "open") {
      const { blocking } = publishIssues(p);
      if (blocking.length) {
        flash(blocking.join(" · "));
        return;
      }
    }
    setItems(updateProduct(p.id, { status: next }));
    flash(STATUS_LABEL[next]);
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

  const catLabel = (id: string) => cats.find((c) => c.id === id)?.label || id;

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
          <h2 className="font-bold mb-3">افزودن (پیش‌نویس)</h2>
          <div className="space-y-2">
            <input
              value={nameFa}
              onChange={(e) => setNameFa(e.target.value)}
              placeholder="نام"
              className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
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
            <label className="block text-xs text-[var(--secondary)]">
              عکس (فشرده می‌شود)
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => onImages(e.target.files)}
                className="mt-1 block w-full text-sm"
              />
            </label>
            {images.length > 0 && (
              <p className="text-xs text-[var(--secondary)]">{images.length} عکس آماده</p>
            )}
            <button
              type="button"
              onClick={onAdd}
              className="w-full rounded-full bg-[var(--foreground)] py-2.5 text-sm text-[var(--background)]"
            >
              افزودن پیش‌نویس
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right space-y-4">
          <div>
            <h2 className="font-bold mb-2">ورود از اکسل</h2>
            <p className="text-xs text-[var(--secondary)] mb-2">
              CSV UTF-8 · nameFa, category, price, stock
            </p>
            <input
              type="file"
              accept=".csv,text/csv,.txt"
              onChange={(e) => onImportFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
          </div>
          <div>
            <h2 className="font-bold mb-2">فیلتر وضعیت</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "all")}
              className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white text-right"
            >
              <option value="all">همه</option>
              <option value="draft">پیش‌نویس</option>
              <option value="open">باز</option>
              <option value="closed">بسته</option>
            </select>
          </div>
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
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="text-right px-3 py-3 font-medium">نام</th>
              <th className="text-right px-3 py-3 font-medium">دسته</th>
              <th className="text-right px-3 py-3 font-medium">وضعیت</th>
              <th className="text-right px-3 py-3 font-medium">قیمت</th>
              <th className="text-right px-3 py-3 font-medium">انبار</th>
              <th className="text-right px-3 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const st = (p.status ?? "open") as ProductStatus;
              return (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2.5 font-medium text-right">
                    {p.nameFa}
                    {!hasRealImage(p) && (
                      <span className="block text-[10px] text-[var(--secondary)]">بدون عکس واقعی</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--secondary)] text-right">
                    {catLabel(p.category)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <select
                      value={st}
                      onChange={(e) => changeStatus(p, e.target.value as ProductStatus)}
                      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs bg-white"
                    >
                      {(Object.keys(STATUS_LABEL) as ProductStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <input
                      type="text"
                      dir="ltr"
                      defaultValue={String(p.price)}
                      key={`${p.id}-${p.price}`}
                      onBlur={(e) => {
                        const v = parseIntLoose(e.target.value);
                        if (v !== p.price) {
                          setItems(updateProduct(p.id, { price: v }));
                          refreshHistory();
                          flash(`${formatPrice(p.price)} → ${formatPrice(v)}`);
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
                        const v = parseIntLoose(e.target.value);
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
                        disabled={p.stock <= 0 || st !== "open"}
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
              );
            })}
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
          <p className="text-sm text-[var(--secondary)]">هنوز تغییری ثبت نشده.</p>
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
