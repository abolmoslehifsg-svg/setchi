"use client";

import Image from "next/image";
import Link from "next/link";
import { Outfit } from "@/types";
import { formatPrice, getOutfitTotalPrice } from "@/data/products";
import { useFavorites } from "@/context/FavoritesContext";

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(outfit.id);
  const total =
    getOutfitTotalPrice(outfit.items.map((i) => i.productId)) ||
    outfit.estimatedPrice;

  return (
    <article className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <Link href={`/outfits/${outfit.id}/`} className="block">
        <div className="relative aspect-[3/4] bg-[var(--muted)]">
          <Image
            src={outfit.image}
            alt={outfit.titleFa}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-base leading-snug">{outfit.titleFa}</h3>
          <p className="mt-1 text-sm text-[var(--secondary)] line-clamp-2">{outfit.descriptionFa}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium">{formatPrice(total)}</span>
            <span className="text-xs text-[var(--secondary)]">{outfit.items.length} آیتم</span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(outfit.id);
        }}
        className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-sm shadow-sm"
        aria-label="علاقه‌مندی"
      >
        {isFav ? "♥" : "♡"}
      </button>
    </article>
  );
}
