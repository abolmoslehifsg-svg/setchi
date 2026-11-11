"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products, formatPrice } from "@/data/products";
import { outfits } from "@/data/outfits";
import { clearAdminSession, isAdminLoggedIn } from "@/lib/admin-auth";
import { getCurrentSeason, SEASON_LABEL_FA } from "@/lib/season";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const ok = isAdminLoggedIn();
    setAuthed(ok);
    setReady(true);
    if (!ok) {
      router.replace("/auth/login/");
    }
  }, [router]);

  const logout = () => {
    clearAdminSession();
    router.push("/auth/login/");
  };

  if (!ready || !authed) {
    return (
      <div className="py-24 text-center text-[var(--secondary)] text-sm">
        در حال بررسی دسترسی...
      </div>
    );
  }

  const season = getCurrentSeason();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">پنل مدیریت</h1>
          <p className="mt-2 text-[var(--secondary)] text-sm">
            نسخه استاتیک — مشاهده محصولات و استایل‌ها · تم فعلی:{" "}
            {SEASON_LABEL_FA[season]}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--muted)]"
          >
            بازگشت به سایت
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
          >
            خروج ادمین
          </button>
        </div>
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
          <p className="text-lg font-semibold mt-1 text-amber-700">
            قفل سبک کلاینت
          </p>
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
                  <td className="px-4 py-3 text-[var(--secondary)]">
                    {p.category}
                  </td>
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

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950 space-y-3">
        <p className="font-semibold">امنیت و تعویض رمز</p>
        <ol className="list-decimal list-inside space-y-1.5 text-amber-900">
          <li>
            فایل{" "}
            <code className="bg-amber-100 px-1 rounded">
              src/lib/admin-config.ts
            </code>{" "}
            را باز کن.
          </li>
          <li>
            مقادیر <code className="bg-amber-100 px-1 rounded">username</code> و{" "}
            <code className="bg-amber-100 px-1 rounded">password</code> را عوض
            کن (ترجیحاً رمز قوی‌تر از آیدی تلگرام).
          </li>
          <li>
            دوباره <code className="bg-amber-100 px-1 rounded">npm run build</code>{" "}
            بگیر و روی GitHub Pages / هاست آپلود کن.
          </li>
        </ol>
        <p className="text-amber-800 leading-relaxed">
          روی سایت استاتیک، رمز داخل باندل جاوااسکریپت قابل استخراج است. این
          فقط جلوی کاربر معمولی را می‌گیرد. برای امنیت واقعی بعداً Auth سروری
          (مثل Supabase) لازم است.
        </p>
      </div>
    </div>
  );
}
