"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/data/products";
import { clearAdminSession, isAdminLoggedIn } from "@/lib/admin-auth";
import {
  CatalogProduct,
  CATEGORY_OPTIONS,
  addProduct,
  applyCategoryDiscount,
  clearCategoryDiscount,
  importCsvMerge,
  loadCatalog,
  removeProduct,
  resetCatalogToBase,
  sellOne,
  updateProduct,
} from "@/lib/admin-catalog";
import { ProductCategory } from "@/types";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [nameFa, setNameFa] = useState("");
  const [category, setCategory] = useState<ProductCategory>("oversized-tshirt");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [discCat, setDiscCat] = useState<ProductCategory | "all">("all");
  const [discPct, setDiscPct] = useState("10");

  useEffect(() => {
    const ok = isAdminLoggedIn();
    setAuthed(ok);
    setReady(true);
    if (!ok) {
      router.replace("/auth/login/");
      return;
    }
    setItems(loadCatalog());
  }, [router]);

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
      flash("نام محصول لازم است");
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
    flash("محصول اضافه شد");
  };

  const onImportFile = async (file: File | null) => {
    if (!file) return;
    const before = loadCatalog().length;
    const text = await file.text();
    const next = importCsvMerge(text);
    setItems(next);
    flash(`${Math.max(0, next.length - before)} ردیف وارد شد`);
  };

  if (!ready || !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--secondary)]">
        در حال بررسی دسترسی...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* هدر پنل */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-right">
            <h1 className="text-2xl font-bold">پنل مدیریت</h1>
            <p className="mt-1 text-sm text-[var(--secondary)]">
              {items.length} محصول · انبار: {totalStock}
              {msg ? ` · ${msg}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--muted)]"
            >
              بازگشت به سایت
            </Link>
            <button
              type="button"
              onClick={() => {
                if (confirm("بازنشانی کاتالوگ؟")) {
                  setItems(resetCatalogToBase());
                  flash("بازنشانی شد");
                }
              }}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            >
              بازنشانی
            </button>
            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                router.push("/auth/login/");
              }}
              className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
            >
              خروج
            </button>
          </div>
        </div>

        {/* تخفیف */}
        <section className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="font-bold mb-3 text-right">تخفیف دسته</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <label className="text-sm flex-1 text-right">
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
            <label className="text-sm w-full sm:w-24 text-right">
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
                setItems(
                  applyCategoryDiscount(
                    discCat,
                    parseFloat(discPct.replace(",", ".")) || 0
                  )
                );
                flash("تخفیف اعمال شد");
              }}
              className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
            >
              اعمال
            </button>
            <button
              type="button"
              onClick={() => {
                setItems(clearCategoryDiscount(discCat));
                flash("تخفیف برداشته شد");
              }}
              className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm"
            >
              حذف تخفیف
            </button>
          </div>
        </section>

        {/* افزودن + ایمپورت */}
        <section className="mb-4 grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right">
            <h2 className="font-bold mb-3">افزودن محصول</h2>
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
                {CATEGORY_OPTIONS.map((c) => (
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
              CSV UTF-8 · ستون‌ها: nameFa, category, price, stock
            </p>
            <input
              type="file"
              accept=".csv,text/csv,.txt"
              onChange={(e) => onImportFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
          </div>
        </section>

        {/* جدول */}
        <div className="mb-3 flex flex-wrap items-center gap-3 justify-between">
          <h2 className="font-bold text-right">محصولات</h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو..."
            className="w-full max-w-xs rounded-full border border-[var(--border)] px-4 py-1.5 text-sm bg-white text-right"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
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
                    {CATEGORY_OPTIONS.find((c) => c.value === p.category)?.label ||
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
                          flash("قیمت ذخیره شد");
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
                          flash("موجودی ذخیره شد");
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
      </div>
    </div>
  );
}
