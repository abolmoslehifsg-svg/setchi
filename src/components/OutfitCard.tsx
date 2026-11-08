import Link from "next/link";
import Image from "next/image";
import { Outfit } from "@/types";
import { formatPrice } from "@/data/products";

interface OutfitCardProps {
  outfit: Outfit;
  priority?: boolean;
}

export function OutfitCard({ outfit, priority = false }: OutfitCardProps) {
  return (
    <Link
      href={`/outfits/${outfit.id}`}
      className="group block overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
        <Image
          src={outfit.image}
          alt={outfit.titleFa}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover outfit-image"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 right-3 left-3 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {outfit.style.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-[var(--foreground)] backdrop-blur-sm"
            >
              {styleLabel(s)}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
          {outfit.titleFa}
        </h3>
        <p className="mt-1 text-sm text-[var(--secondary)] line-clamp-2">
          {outfit.descriptionFa}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {formatPrice(outfit.estimatedPrice)}
          </span>
          <span className="text-xs text-[var(--secondary)]">
            {outfit.items.length} آیتم
          </span>
        </div>
      </div>
    </Link>
  );
}

function styleLabel(style: string): string {
  const map: Record<string, string> = {
    streetwear: "استریت‌ویر",
    casual: "کژوال",
    sporty: "اسپرتی",
    minimalist: "مینیمال",
    modern: "مدرن",
  };
  return map[style] || style;
}
