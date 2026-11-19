"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { getProductById, formatPrice, productHref } from "@/data/products";
import { loadOutfits } from "@/lib/outfits-storage";
import { outfits as baseOutfits } from "@/data/outfits";
import { HeartButton } from "@/components/HeartButton";
import { OutfitCard } from "@/components/OutfitCard";
import type { Outfit } from "@/types";
import type { Product } from "@/types";

export default function FavoritesPage() {
  const {
    favorites,
    productFavorites,
    toggleFavorite,
    toggleProductFavorite,
    isProductFavorite,
  } = useFavorites();

  const [ready, setReady] = useState(false);
  const [outfitList, setOutfitList] = useState<Outfit[]>([]);
  const [missingOutfitIds, setMissingOutfitIds] = useState<string[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    const all = loadOutfits();
    const byId = new Map<string, Outfit>();
    for (const o of all) byId.set(o.id, o);
    for (const o of baseOutfits) {
      if (!byId.has(o.id)) byId.set(o.id, o);
    }

    const found: Outfit[] = [];
    const missing: string[] = [];
    for (const id of favorites) {
      const o = byId.get(id);
      if (o) found.push(o);
      else missing.push(id);
    }
    setOutfitList(found);
    setMissingOutfitIds(missing);

    const prods: Product[] = [];
    for (const id of productFavorites) {
      const p = getProductById(id);
      if (p) prods.push(p);
    }
    setProductList(prods);
    setReady(true);
  }, [favorites, productFavorites]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[var(--secondary)]">
        بارگذاری علاقه‌مندی‌ها…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16" dir="rtl">
      <div className="mb-10">
        <p className="text-xs tracking-widest text-[var(--accent)] uppercase mb-1">Favorites</p>
        <h1 className="text-3xl font-bold tracking-tight">علاقه‌مندی‌های من</h1>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          فقط چیزهایی که با قلب علامت زدی — نه کل گالری.
        </p>
      </div>

      <section className="mb-14">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">
            استایل‌ها ({outfitList.length}
            {missingOutfitIds.length ? ` · ${missingOutfitIds.length} نامعتبر` : ""})
          </h2>
          <Link href="/outfits/" className="text-sm text-link shrink-0">
            رفتن به گالری
          </Link>
        </div>

        {outfitList.length === 0 && missingOutfitIds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
            <p className="font-medium mb-2">هنوز استایلی قلب نزدی</p>
            <p className="text-sm text-[var(--secondary)] mb-5">
              در گالری روی قلب هر استایل بزن؛ بعد اینجا فقط همان‌ها را می‌بینی.
            </p>
            <Link href="/outfits/" className="btn btn-cta px-6 py-2.5 text-sm inline-flex">
              باز کردن گالری استایل‌ها
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfitList.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        )}

        {missingOutfitIds.length > 0 && (
          <div className="mt-4 rounded-xl border border-[var(--border)] p-4 text-sm">
            <p className="text-[var(--secondary)] mb-2">
              چند استایل ذخیره‌شده دیگر در کاتالوگ نیست:
            </p>
            <ul className="space-y-2">
              {missingOutfitIds.map((id) => (
                <li key={id} className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs truncate">{id}</span>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(id)}
                    className="text-xs text-red-600 shrink-0"
                  >
                    حذف از علاقه‌مندی
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">لباس‌ها ({productList.length})</h2>
          <Link href="/products/" className="text-sm text-link shrink-0">
            کاتالوگ
          </Link>
        </div>

        {productList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
            <p className="text-sm text-[var(--secondary)]">
              هنوز لباسی علامت نزدی. در کاتالوگ روی قلب بزن.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList.map((p) => (
              <div
                key={p.id}
                className="relative rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]"
              >
                <div className="absolute top-2 left-2 z-10">
                  <HeartButton
                    active={isProductFavorite(p.id)}
                    onToggle={() => toggleProductFavorite(p.id)}
                    size="sm"
                  />
                </div>
                <Link href={productHref(p.id)} className="block">
                  <div className="relative aspect-[3/4] bg-[var(--muted)]">
                    <Image
                      src={p.images[0]}
                      alt={p.nameFa}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{p.nameFa}</p>
                    <p className="text-sm mt-1">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
