"use client";

import Link from "next/link";
import Image from "next/image";
import { Outfit } from "@/types";
import { formatPrice, getOutfitTotalPrice } from "@/data/products";
import { outfitHref } from "@/lib/outfits-storage";
import { useFavorites } from "@/context/FavoritesContext";
import {
  BUDGET_LABEL_FA,
  OCCASION_LABEL_FA,
  getOutfitSeasons,
  outfitBudgetBand,
  seasonLabel,
} from "@/lib/outfit-meta";

interface OutfitCardProps {
  outfit: Outfit;
  priority?: boolean;
}

export function OutfitCard({ outfit, priority = false }: OutfitCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(outfit.id);
  const price =
    getOutfitTotalPrice(outfit.items.map((i) => i.productId)) || outfit.estimatedPrice;
  const oc = outfit.occasion[0];
  const se = getOutfitSeasons(outfit)[0];

  return (
    <div className="group relative block overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm card-interactive">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(outfit.id);
        }}
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[var(--foreground)] hover:text-[var(--accent)] hover:scale-110 active:scale-95 transition-transform"
        aria-label="علاقه‌مندی"
      >
        <svg
          className="w-4 h-4"
          fill={fav ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
      <Link href={outfitHref(outfit.id)} prefetch={false}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
          <Image
            src={outfit.image}
            alt={outfit.titleFa}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover outfit-image"
            priority={priority}
          />
          <div className="absolute bottom-3 right-3 left-3 flex flex-wrap gap-1.5">
            {oc && (
              <span className="rounded-full bg-black/55 text-white text-[10px] font-medium px-2 py-0.5 backdrop-blur">
                {OCCASION_LABEL_FA[oc] || oc}
              </span>
            )}
            {se && (
              <span className="rounded-full bg-black/55 text-white text-[10px] font-medium px-2 py-0.5 backdrop-blur">
                {seasonLabel(se)}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors duration-300">
            {outfit.titleFa}
          </h3>
          <p className="mt-1 text-sm text-[var(--secondary)] line-clamp-2">
            {outfit.descriptionFa}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{formatPrice(price)}</span>
            <span className="text-[10px] text-[var(--secondary)] shrink-0">
              {BUDGET_LABEL_FA[outfitBudgetBand(price)]} · {outfit.items.length} تکه
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
