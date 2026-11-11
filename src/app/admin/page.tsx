"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/data/products";
import { loadCatalog } from "@/lib/admin-catalog";
import {
  getActiveApprox,
  getSalesSummary,
  getVisitCount,
} from "@/lib/admin-stats";

export default function AdminDashboard() {
  const [visits, setVisits] = useState(0);
  const [active, setActive] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [stock, setStock] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recent, setRecent] = useState<
    { nameFa: string; price: number; at: number }[]
  >([]);
  const [top, setTop] = useState<
    { nameFa: string; count: number; total: number }[]
  >([]);

  useEffect(() => {
    const items = loadCatalog();
    setProductCount(items.length);
    setStock(items.reduce((a, p) => a + p.stock, 0));
    setVisits(getVisitCount());
    setActive(getActiveApprox());
    const s = getSalesSummary();
    setSalesCount(s.totalSales);
    setRevenue(s.revenue);
    setRecent(s.recent);
    setTop(s.top.slice(0, 8));
  }, []);

  const fmtTime = (t: number) =>
    new Date(t).toLocaleString("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl" dir="rtl">
      <div className="mb-8 text-right">
        <h1 className="text-3xl font-bold">خوش آمدی</h1>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          خلاصه وضعیت ستچی روی این مرورگر
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Card title="بازدید" value={String(visits)} sub="ثبت‌شده محلی" />
        <Card title="فعال تقریبی" value={String(active)} sub="۲۴ ساعت اخیر" />
        <Card title="فروش" value={String(salesCount)} sub="از دکمه فروش ۱" />
        <Card title="درآمد تقریبی" value={formatPrice(revenue)} sub="جمع فروش‌ها" />
        <Card title="محصولات" value={String(productCount)} sub="کاتالوگ" />
        <Card title="انبار" value={String(stock)} sub="مجموع موجودی" />
      </div>

      <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-right">
        <h2 className="font-bold mb-4">آخرین فروش‌ها</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-[var(--secondary)]">هنوز فروشی ثبت نشده.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((s, i) => (
              <li
                key={`${s.at}-${i}`}
                className="flex items-center justify-between gap-3 text-sm border-b border-[var(--border)] pb-2 last:border-0"
              >
                <span className="font-medium">{s.nameFa}</span>
                <span className="text-[var(--secondary)] shrink-0">
                  {formatPrice(s.price)} · {fmtTime(s.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-right">
        <h2 className="font-bold mb-4">پرفروش‌ها</h2>
        {top.length === 0 ? (
          <p className="text-sm text-[var(--secondary)]">داده‌ای نیست.</p>
        ) : (
          <ul className="space-y-2">
            {top.map((t) => (
              <li
                key={t.nameFa}
                className="flex items-center justify-between gap-3 text-sm border-b border-[var(--border)] pb-2 last:border-0"
              >
                <span className="font-medium">{t.nameFa}</span>
                <span className="text-[var(--secondary)] shrink-0">
                  {t.count} عدد · {formatPrice(t.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 text-[11px] text-[var(--secondary)] leading-relaxed text-right">
        آمار بازدید و فروش روی همین مرورگر (localStorage) ذخیره می‌شود. برای آمار
        واقعی چنددستگاهی بعداً سرویس آنالیتیکس یا دیتابیس لازم است.
      </p>
    </div>
  );
}

function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right">
      <p className="text-xs text-[var(--secondary)]">{title}</p>
      <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10px] text-[var(--secondary)]">{sub}</p>
    </div>
  );
}
