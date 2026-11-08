"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { outfits } from "@/data/outfits";
import { formatPrice } from "@/data/products";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">پنل مدیریت</h1>
        <p className="mt-2 text-[var(--secondary)]">
          مدیریت محصولات و استایل‌ها (نسخه موقت — بعد از اتصال Supabase کامل می‌شود)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--secondary)]">تعداد محصولات</p>
          <p className="text-3xl font-bold mt-1">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--secondary)]">تعداد استایل‌ها</p>
          <p className="text-3xl font-bold mt-1">{outfits.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--secondary)]">وضعیت</p>
          <p className="text-lg font-semibold mt-1 text-amber-600">حالت موقت (بدون دیتابیس)</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">محصولات فعلی</h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="text-right px-4 py-3 font-medium">نام</th>
                <th className="text-right px-4 py-3 font-medium">دسته‌بندی</th>
                <th className="text-right px-4 py-3 font-medium">قیمت</th>
                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-medium">{p.nameFa}</td>
                  <td className="px-4 py-3 text-[var(--secondary)]">{p.category}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-medium">
                      موجود
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-sm text-amber-900">
        <p className="font-semibold mb-2">برای فعال‌سازی کامل پنل ادمین:</p>
        <ol className="list-decimal list-inside space-y-1 text-amber-800">
          <li>حساب رایگان Supabase بساز</li>
          <li>فایل <code className="bg-amber-100 px-1 rounded">supabase-schema.sql</code> را در SQL Editor اجرا کن</li>
          <li>کلیدهای API را در <code className="bg-amber-100 px-1 rounded">.env.local</code> قرار بده</li>
          <li>نقش یکی از کاربران را به <code className="bg-amber-100 px-1 rounded">admin</code> تغییر بده</li>
        </ol>
        <p className="mt-3">راهنمای کامل در فایل <strong>SETUP-FA.md</strong> هست.</p>
      </div>
    </div>
  );
}
