"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OutfitCard } from "@/components/OutfitCard";
import { OutfitComments } from "@/components/OutfitComments";
import {
  BUDGET_LABEL_FA,
  FIT_LABEL_FA,
  OCCASION_LABEL_FA,
  ROLE_LABEL_FA,
  getOutfitSeasons,
  outfitBudgetBand,
  seasonLabel,
} from "@/lib/outfit-meta";
import { formatPrice, productHref, getProductById } from "@/data/products";
import {
  getOutfitByIdLive,
  loadOutfits,
  OUTFITS_UPDATED_EVENT,
} from "@/lib/outfits-storage";
import type { Outfit } from "@/types";

const roleLabels: Record<string, string> = {
  top: "بالا",
  bottom: "پایین",
  footwear: "کفش",
  outer: "رویه",
  accessory: "اکسسوری",
};

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

export function OutfitDetail({ id }: { id: string }) {
  const [outfit, setOutfit] = useState<Outfit | undefined>(undefined);
  const [related, setRelated] = useState<Outfit[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const o = getOutfitByIdLive(id);
      setOutfit(o);
      if (o) {
        const all = loadOutfits();
        setRelated(
          all
            .filter(
              (x) =>
                x.id !== o.id &&
                x.style.some((s) => o.style.includes(s))
            )
            .slice(0, 4)
        );
      } else {
        setRelated([]);
      }
      setReady(true);
    };
    sync();
    window.addEventListener(OUTFITS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(OUTFITS_UPDATED_EVENT, sync);
  }, [id]);

  if (!outfit) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-[var(--secondary)]">
          {ready ? "استایل پیدا نشد." : "در حال بارگذاری..."}
        </p>
        {ready && (
          <Link
            href="/outfits/"
            className="mt-6 inline-block rounded-full border border-[var(--border)] px-7 py-3 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
          >
            بازگشت به گالری
          </Link>
        )}
      </div>
    );
  }

  const products = outfit.items
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...product, role: item.role } : null;
    })
    .filter(Boolean) as Array<
    NonNullable<ReturnType<typeof getProductById>> & { role: string }
  >;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--muted)]">
          <Image
            src={outfit.image}
            alt={outfit.titleFa}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {outfit.occasion.slice(0, 3).map((oc) => (
              <span
                key={oc}
                className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1 text-xs font-medium"
              >
                {OCCASION_LABEL_FA[oc] || oc}
              </span>
            ))}
            {getOutfitSeasons(outfit).slice(0, 2).map((s) => (
              <span key={s} className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium">
                {seasonLabel(s)}
              </span>
            ))}
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium">
              {BUDGET_LABEL_FA[outfitBudgetBand(outfit.estimatedPrice)]}
            </span>
            {outfit.fit && (
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium">
                {FIT_LABEL_FA[outfit.fit]}
              </span>
            )}
            {outfit.style.map((s) => (
              <span key={s} className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium">
                {styleLabel(s)}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{outfit.titleFa}</h1>
          <p className="mt-2 text-lg text-[var(--secondary)]">{outfit.title}</p>
          <p className="mt-6 text-[var(--secondary)] leading-relaxed">{outfit.descriptionFa}</p>

          <div className="mt-8 p-5 rounded-xl bg-[var(--muted)]">
            <h3 className="font-semibold mb-2">چرا این ترکیب کار می‌کند؟</h3>
            <p className="text-sm text-[var(--secondary)] leading-relaxed">{outfit.whyItWorksFa}</p>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--border)] p-5">
            <h3 className="font-semibold mb-3">دستور پوشیدن</h3>
            <ul className="space-y-2 text-sm">
              {outfit.items.map((item) => {
                const product = getProductById(item.productId);
                return (
                  <li key={item.productId + item.role} className="flex items-center justify-between gap-3">
                    <span className="text-[var(--secondary)]">{ROLE_LABEL_FA[item.role] || item.role}</span>
                    <span className="font-medium text-left truncate">{product?.nameFa || "قطعه"}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-[var(--secondary)] leading-relaxed">
              اگر یکی از تکه‌ها را نداری: از گالری محصول هم‌نقش با رنگ نزدیک انتخاب کن، یا در کمد
              جایگزین ثبت کن و دوباره از دستیار استایل بساز.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/wardrobe/" className="text-sm text-link font-medium">افزودن به کمد من</Link>
              <span className="text-[var(--border)]">·</span>
              <Link href="/products/" className="text-sm text-link font-medium">دیدن محصولات</Link>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
            <div>
              <p className="text-sm text-[var(--secondary)]">قیمت تقریبی</p>
              <p className="text-2xl font-bold mt-1">{formatPrice(outfit.estimatedPrice)}</p>
            </div>
            <Link
              href="/style-assistant/"
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
            >
              ساخت استایل مشابه
            </Link>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold mb-8">اجزا این استایل</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p.id}
                href={productHref(p.id)}
                prefetch={false}
                className="group flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition-shadow"
              >
                <div className="relative w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]">
                  <Image src={p.images[0]} alt={p.nameFa} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[var(--accent)] font-medium">{roleLabels[p.role] || p.role}</span>
                  <h3 className="font-semibold mt-1 group-hover:text-[var(--accent)] transition-colors truncate">{p.nameFa}</h3>
                  <p className="mt-2 text-sm font-medium">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <OutfitComments outfitId={outfit.id} />

      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold mb-8">استایل‌های مشابه</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
