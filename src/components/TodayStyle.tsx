"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OutfitCard } from "@/components/OutfitCard";
import { loadOutfits } from "@/lib/outfits-storage";
import { getCurrentSeason, SEASON_LABEL_FA, type Season } from "@/lib/season";
import { getOutfitSeasons, OCCASION_LABEL_FA } from "@/lib/outfit-meta";
import { getOutfitTotalPrice } from "@/data/products";
import type { Occasion, Outfit } from "@/types";
import { loadItems } from "@/lib/wardrobe/storage";

const OCCASIONS: Occasion[] = [
  "daily",
  "work",
  "university",
  "party",
  "casual-outings",
  "sport",
];

const SEASONS: Season[] = ["spring", "summer", "fall", "winter"];

/**
 * جریان ۳مرحله‌ای: موقعیت → فصل → ۲–۳ استایل پیشنهادی
 */
export function TodayStyle() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [useWardrobe, setUseWardrobe] = useState(false);

  const wardrobeCount = useMemo(() => {
    try {
      return loadItems().length || 0;
    } catch {
      return 0;
    }
  }, [step]);

  const picks = useMemo(() => {
    if (!occasion) return [] as Outfit[];
    const all = loadOutfits();
    const scored = all
      .map((o) => {
        let score = 0;
        if (o.occasion.includes(occasion)) score += 40;
        if (getOutfitSeasons(o).includes(season)) score += 25;
        const price =
          getOutfitTotalPrice(o.items.map((i) => i.productId)) || o.estimatedPrice;
        if (price < 8_000_000) score += 8;
        score += o.id.charCodeAt(1) % 5;
        return { o, score };
      })
      .filter((x) => x.score >= 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.o);
    return scored.length ? scored : all.slice(0, 3);
  }, [occasion, season, step]);

  return (
    <section
      id="today-style"
      className="border-y border-[var(--border)] bg-[var(--card)]"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-2">مسیر سریع</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              استایل امروز من
            </h2>
            <p className="mt-2 text-sm text-[var(--secondary)] max-w-xl">
              سه قدم: موقعیت → فصل → پیشنهاد آماده. بدون گم شدن در منوها.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--secondary)]">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-bold ${
                  step === n
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : step > n
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "bg-[var(--muted)]"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <p className="text-sm font-medium mb-4">امروز کجا می‌روی؟</p>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((oc) => (
                <button
                  key={oc}
                  type="button"
                  onClick={() => {
                    setOccasion(oc);
                    setStep(2);
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium border transition-colors ${
                    occasion === oc
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                      : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {OCCASION_LABEL_FA[oc]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm font-medium mb-4">فصل / هوا تقریباً چطور است؟</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {SEASONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeason(s)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium border transition-colors ${
                    season === s
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                      : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {SEASON_LABEL_FA[s]}
                  {s === getCurrentSeason() ? " · الان" : ""}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--secondary)] mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={useWardrobe}
                onChange={(e) => setUseWardrobe(e.target.checked)}
                className="rounded border-[var(--border)]"
              />
              اولویت با لباس‌های کمد من
              {wardrobeCount > 0 ? (
                <span className="text-xs">({wardrobeCount} آیتم)</span>
              ) : (
                <Link href="/wardrobe/" className="text-link text-xs">
                  (کمد خالی است — اضافه کن)
                </Link>
              )}
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-ghost px-5 py-2.5 text-sm"
              >
                قبلی
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn btn-cta px-6 py-2.5 text-sm"
              >
                ببین چه بپوشم
              </button>
            </div>
          </div>
        )}

        {step === 3 && occasion && (
          <div>
            <p className="text-sm text-[var(--secondary)] mb-6">
              برای{" "}
              <strong className="text-[var(--foreground)]">
                {OCCASION_LABEL_FA[occasion]}
              </strong>{" "}
              · {SEASON_LABEL_FA[season]}
              {useWardrobe && wardrobeCount > 0
                ? " · با در نظر گرفتن کمد"
                : ""}
            </p>
            {picks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
                <p className="text-[var(--secondary)] mb-4">
                  چیزی پیدا نشد. فیلتر را عوض کن یا گالری را ببین.
                </p>
                <Link href="/outfits/" className="btn btn-outline px-5 py-2.5 text-sm">
                  گالری استایل‌ها
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {picks.map((o, i) => (
                  <div key={o.id} className="relative">
                    {i === 0 && (
                      <span className="absolute top-3 right-3 z-10 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] text-[10px] font-bold px-2.5 py-1">
                        پیشنهاد اول
                      </span>
                    )}
                    <OutfitCard outfit={o} priority={i === 0} />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-ghost px-5 py-2.5 text-sm"
              >
                تغییر فصل
              </button>
              <Link
                href={`/outfits/?occasion=${occasion}&season=${season}`}
                className="btn btn-outline px-5 py-2.5 text-sm"
              >
                همه نتایج در گالری
              </Link>
              <Link href="/wardrobe/" className="btn btn-cta px-5 py-2.5 text-sm">
                ساخت از کمد من
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
