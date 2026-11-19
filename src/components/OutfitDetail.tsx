"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  formatPrice,
  productHref,
  getProductById,
  getOutfitTotalPrice,
} from "@/data/products";
import {
  getOutfitByIdLive,
  loadOutfits,
  OUTFITS_UPDATED_EVENT,
} from "@/lib/outfits-storage";
import { getAlternatives, liveOutfitTotal } from "@/lib/outfit-swap";
import {
  isLookSaved,
  toggleSaveLook,
  COLLECTIONS_EVENT,
} from "@/lib/collections";
import type { Outfit } from "@/types";

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [swapRoleIdx, setSwapRoleIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      const o = getOutfitByIdLive(id);
      setOutfit(o);
      if (o) {
        setSelectedIds(o.items.map((i) => i.productId));
        const all = loadOutfits();
        setRelated(
          all
            .filter(
              (x) => x.id !== o.id && x.style.some((s) => o.style.includes(s))
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

  useEffect(() => {
    if (!outfit) return;
    const check = () =>
      setSaved(isLookSaved(outfit.id, selectedIds.length ? selectedIds : undefined));
    check();
    window.addEventListener(COLLECTIONS_EVENT, check);
    return () => window.removeEventListener(COLLECTIONS_EVENT, check);
  }, [outfit, selectedIds]);

  const liveTotal = useMemo(() => {
    if (!selectedIds.length) return 0;
    const t = liveOutfitTotal(selectedIds);
    if (t > 0) return t;
    return outfit
      ? getOutfitTotalPrice(outfit.items.map((i) => i.productId)) ||
          outfit.estimatedPrice
      : 0;
  }, [selectedIds, outfit]);

  const catalogEstimate = outfit?.estimatedPrice ?? 0;
  const priceMismatch =
    catalogEstimate > 0 &&
    liveTotal > 0 &&
    Math.abs(catalogEstimate - liveTotal) / catalogEstimate > 0.08;

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

  const lineItems = outfit.items.map((item, idx) => {
    const pid = selectedIds[idx] || item.productId;
    const product = getProductById(pid);
    return { ...item, productId: pid, product, idx };
  });

  const alts =
    swapRoleIdx !== null
      ? getAlternatives(
          lineItems[swapRoleIdx]?.productId || "",
          lineItems[swapRoleIdx]?.role || "top",
          6
        )
      : [];

  const onSave = () => {
    const res = toggleSaveLook({
      outfit,
      productIds: selectedIds,
      totalPrice: liveTotal,
    });
    setSaved(res.saved);
  };

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
            {getOutfitSeasons(outfit)
              .slice(0, 2)
              .map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium"
                >
                  {seasonLabel(s)}
                </span>
              ))}
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium">
              {BUDGET_LABEL_FA[outfitBudgetBand(liveTotal || catalogEstimate)]}
            </span>
            {outfit.fit && (
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium">
                {FIT_LABEL_FA[outfit.fit]}
              </span>
            )}
            {outfit.style.map((s) => (
              <span
                key={s}
                className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium"
              >
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
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-semibold">اجزا · قابل تعویض</h3>
              <span className="text-xs text-[var(--secondary)]">روی هر تکه بزن تا جایگزین ببینی</span>
            </div>
            <ul className="space-y-3">
              {lineItems.map((row) => (
                <li key={row.idx}>
                  <button
                    type="button"
                    onClick={() => setSwapRoleIdx(swapRoleIdx === row.idx ? null : row.idx)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-2.5 text-right transition-colors ${
                      swapRoleIdx === row.idx
                        ? "border-[var(--interactive,#40E0D0)] bg-[var(--interactive-soft,rgba(64,224,208,0.15))]"
                        : "border-[var(--border)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    <div className="relative w-14 h-16 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]">
                      {row.product?.images?.[0] && (
                        <Image src={row.product.images[0]} alt="" fill className="object-cover" sizes="56px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--secondary)]">{ROLE_LABEL_FA[row.role] || row.role}</p>
                      <p className="font-medium truncate text-sm">{row.product?.nameFa || "قطعه"}</p>
                      <p className="text-xs mt-0.5">{row.product ? formatPrice(row.product.price) : "—"}</p>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: "var(--interactive, #40E0D0)" }}>تعویض</span>
                  </button>
                  {swapRoleIdx === row.idx && (
                    <div className="mt-2 grid grid-cols-3 gap-2 pr-1">
                      {alts.length === 0 ? (
                        <p className="col-span-3 text-xs text-[var(--secondary)] py-2">جایگزین هم‌دسته پیدا نشد.</p>
                      ) : (
                        alts.map((alt) => (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => {
                              setSelectedIds((prev) => {
                                const next = [...prev];
                                next[row.idx] = alt.id;
                                return next;
                              });
                              setSwapRoleIdx(null);
                            }}
                            className="rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--interactive,#40E0D0)] text-left"
                          >
                            <div className="relative aspect-square bg-[var(--muted)]">
                              <Image src={alt.images[0]} alt={alt.nameFa} fill className="object-cover" sizes="100px" />
                            </div>
                            <div className="p-1.5">
                              <p className="text-[10px] truncate">{alt.nameFa}</p>
                              <p className="text-[10px] font-medium">{formatPrice(alt.price)}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[var(--secondary)] leading-relaxed">
              قیمت کل از جمع محصولات فعلی محاسبه می‌شود.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border)] pt-6">
            <div>
              <p className="text-sm text-[var(--secondary)]">قیمت ترکیب فعلی</p>
              <p className="text-2xl font-bold mt-1">{formatPrice(liveTotal)}</p>
              {priceMismatch && (
                <p className="text-[11px] mt-1" style={{ color: "var(--warning, #8A4B16)" }}>
                  تخمین قبلی کاتالوگ: {formatPrice(catalogEstimate)} — قیمت زنده از محصولات به‌روز است
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onSave}
                className={`rounded-full px-5 py-3 text-sm font-medium border transition-colors ${
                  saved
                    ? "border-transparent"
                    : "border-[var(--border)] hover:bg-[var(--muted)]"
                }`}
                style={saved ? { background: "var(--interactive, #40E0D0)", color: "#171717" } : undefined}
              >
                {saved ? "ذخیره شد ✓" : "ذخیره در کالکشن"}
              </button>
              <Link
                href="/style-assistant/"
                className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[var(--background)] hover:opacity-90"
              >
                ساخت استایل مشابه
              </Link>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[var(--secondary)]">
            <Link href="/collections/" className="text-link">مشاهده کالکشن من</Link>
            {" · "}
            <Link href="/wardrobe/" className="text-link">ساخت از کمد</Link>
          </p>
        </div>
      </div>

      <section className="mt-16 lg:mt-24">
        <h2 className="text-2xl font-bold mb-8">لینک مستقیم محصولات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lineItems.map((row) =>
            row.product ? (
              <Link
                key={row.productId + row.role}
                href={productHref(row.product.id)}
                prefetch={false}
                className="group flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition-shadow"
              >
                <div className="relative w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]">
                  <Image src={row.product.images[0]} alt={row.product.nameFa} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[var(--accent)] font-medium">{ROLE_LABEL_FA[row.role] || row.role}</span>
                  <h3 className="font-semibold mt-1 group-hover:text-[var(--accent)] transition-colors truncate">{row.product.nameFa}</h3>
                  <p className="mt-2 text-sm font-medium">{formatPrice(row.product.price)}</p>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </section>

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
