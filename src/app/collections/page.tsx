"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  loadSavedLooks,
  removeSavedLook,
  COLLECTIONS_EVENT,
  type SavedLook,
} from "@/lib/collections";
import { formatPrice } from "@/data/products";
import { outfitHref } from "@/lib/outfits-storage";

export default function CollectionsPage() {
  const [looks, setLooks] = useState<SavedLook[]>([]);

  useEffect(() => {
    const sync = () => setLooks(loadSavedLooks());
    sync();
    window.addEventListener(COLLECTIONS_EVENT, sync);
    return () => window.removeEventListener(COLLECTIONS_EVENT, sync);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16" dir="rtl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">کالکشن من</h1>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          استایل‌هایی که ذخیره کردی — حتی با تعویض آیتم‌ها.
        </p>
      </div>

      {looks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-14 text-center max-w-lg mx-auto">
          <p className="font-medium mb-2">هنوز چیزی ذخیره نکردی</p>
          <p className="text-sm text-[var(--secondary)] mb-6">
            در صفحه هر استایل روی «ذخیره در کالکشن» بزن.
          </p>
          <Link href="/outfits/" className="btn btn-cta px-6 py-2.5 text-sm">
            رفتن به گالری
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((look) => (
            <div
              key={look.id}
              className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]"
            >
              <Link href={outfitHref(look.outfitId)} className="block relative aspect-[3/4] bg-[var(--muted)]">
                <Image src={look.image} alt={look.titleFa} fill className="object-cover" sizes="400px" />
              </Link>
              <div className="p-4">
                <h2 className="font-semibold">{look.titleFa}</h2>
                <p className="text-sm mt-1">{formatPrice(look.totalPrice)}</p>
                <p className="text-[11px] text-[var(--secondary)] mt-1">
                  {look.productIds.length} تکه ·{" "}
                  {new Date(look.savedAt).toLocaleDateString("fa-IR")}
                </p>
                <div className="mt-3 flex gap-3">
                  <Link href={outfitHref(look.outfitId)} className="text-sm text-link">
                    باز کردن
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLooks(removeSavedLook(look.id))}
                    className="text-sm text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
