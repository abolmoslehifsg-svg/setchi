"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { getProductById, formatPrice, productHref } from "@/data/products";
import { getOutfitByIdLive } from "@/lib/outfits-storage";
import { HeartButton } from "@/components/HeartButton";
import { OutfitCard } from "@/components/OutfitCard";

export default function FavoritesPage() {
  const {
    favorites,
    productFavorites,
    toggleProductFavorite,
    isProductFavorite,
  } = useFavorites();

  const outfits = useMemo(
    () => favorites.map((id) => getOutfitByIdLive(id)).filter(Boolean),
    [favorites]
  );

  const products = useMemo(
    () => productFavorites.map((id) => getProductById(id)).filter(Boolean),
    [productFavorites]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16" dir="rtl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">علاقه‌مندی‌ها</h1>
      <p className="text-sm text-[var(--secondary)] mb-10">
        استایل‌ها و لباس‌هایی که با قلب علامت زدی
      </p>

      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4">استایل‌ها ({outfits.length})</h2>
        {outfits.length === 0 ? (
          <p className="text-sm text-[var(--secondary)]">
            هنوز استایلی ذخیره نشده. از گالری روی قلب بزن.{" "}
            <Link href="/outfits/" className="text-link">گالری</Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((o) => o && <OutfitCard key={o.id} outfit={o} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">لباس‌ها ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-sm text-[var(--secondary)]">
            هنوز لباسی علامت نزدی.{" "}
            <Link href="/products/" className="text-link">کاتالوگ</Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(
              (p) =>
                p && (
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
                        <Image src={p.images[0]} alt={p.nameFa} fill className="object-cover" sizes="200px" />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm truncate">{p.nameFa}</p>
                        <p className="text-sm mt-1">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  </div>
                )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
