"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, formatPrice } from "@/data/products";
import { outfits } from "@/data/outfits";
import { Product } from "@/types";

/** Experimental spatial-style outfit browser. Image-based preview — not real AI try-on. */
export default function TryOnPage() {
  const tops = useMemo(() => products.filter((p) => p.category === "oversized-tshirt" || p.category === "hoodie"), []);
  const bottoms = useMemo(() => products.filter((p) => p.category === "cargo-pants"), []);
  const shoes = useMemo(() => products.filter((p) => p.category === "sneakers"), []);
  const outer = useMemo(() => products.filter((p) => p.category === "jacket"), []);

  const [topIdx, setTopIdx] = useState(0);
  const [bottomIdx, setBottomIdx] = useState(0);
  const [shoeIdx, setShoeIdx] = useState(0);
  const [outerIdx, setOuterIdx] = useState(0);
  const [showOuter, setShowOuter] = useState(true);

  const selected: { role: string; product: Product }[] = [
    { role: "بالا", product: tops[topIdx] },
    { role: "پایین", product: bottoms[bottomIdx] },
    { role: "کفش", product: shoes[shoeIdx] },
  ];
  if (showOuter && outer[outerIdx]) selected.unshift({ role: "رویه", product: outer[outerIdx] });

  const total = selected.reduce((s, i) => s + i.product.price, 0);
  const heroImage = outfits[1]?.image || tops[0]?.images[0];
  const cycle = (len: number, idx: number, dir: 1 | -1) => (idx + dir + len) % len;

  return (
    <div className="min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-[var(--accent)] uppercase mb-2">تجربی · Experimental</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">پرو مجازی ست</h1>
          <p className="mt-3 text-[var(--secondary)] leading-relaxed">
            پیش‌نمایش تصویری برای ترکیب قطعات لباس. این تجربه شبیه‌سازی واقعی لباس روی بدن نیست.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
              <Image src={heroImage} alt="مدل استایل" fill className="object-cover" sizes="(max-width:1024px) 100vw, 60vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
                <p className="text-sm text-white/70 mb-1">ترکیب فعلی</p>
                <p className="font-semibold text-lg">{selected.map((s) => s.product.nameFa).join(" · ")}</p>
                <p className="mt-2 text-sm">{formatPrice(total)}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <LayerControl label="رویه (کاپشن)" product={outer[outerIdx]} onPrev={() => setOuterIdx((i) => cycle(outer.length, i, -1))} onNext={() => setOuterIdx((i) => cycle(outer.length, i, 1))} enabled={showOuter} onToggle={() => setShowOuter((v) => !v)} />
            <LayerControl label="بالاتنه" product={tops[topIdx]} onPrev={() => setTopIdx((i) => cycle(tops.length, i, -1))} onNext={() => setTopIdx((i) => cycle(tops.length, i, 1))} />
            <LayerControl label="پایین تنه" product={bottoms[bottomIdx]} onPrev={() => setBottomIdx((i) => cycle(bottoms.length, i, -1))} onNext={() => setBottomIdx((i) => cycle(bottoms.length, i, 1))} />
            <LayerControl label="کفش" product={shoes[shoeIdx]} onPrev={() => setShoeIdx((i) => cycle(shoes.length, i, -1))} onNext={() => setShoeIdx((i) => cycle(shoes.length, i, 1))} />

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 mt-6">
              <h3 className="font-semibold mb-3">جزئیات ترکیب</h3>
              <ul className="space-y-2 text-sm">
                {selected.map((s) => (
                  <li key={s.product.id} className="flex justify-between gap-3">
                    <span className="text-[var(--secondary)]">{s.role}</span>
                    <span className="font-medium truncate">{s.product.nameFa}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-sm text-[var(--secondary)]">جمع تقریبی</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/style-assistant/" className="flex-1 text-center rounded-full bg-[var(--foreground)] py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]">پیشنهاد هوشمند</Link>
                <Link href="/outfits/" className="flex-1 text-center rounded-full border border-[var(--border)] py-3 text-sm font-medium hover:bg-[var(--muted)]">گالری استایل</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerControl({
  label, product, onPrev, onNext, enabled = true, onToggle,
}: {
  label: string; product?: Product; onPrev: () => void; onNext: () => void; enabled?: boolean; onToggle?: () => void;
}) {
  if (!product) return null;
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 flex items-center gap-3 ${!enabled ? "opacity-50" : ""}`}>
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--muted)] shrink-0">
        <Image src={product.images[0]} alt={product.nameFa} fill className="object-cover" sizes="64px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs text-[var(--secondary)]">{label}</p>
          {onToggle && (
            <button type="button" onClick={onToggle} className="text-[10px] text-[var(--accent)] hover:underline">{enabled ? "حذف" : "فعال"}</button>
          )}
        </div>
        <p className="font-medium text-sm truncate">{product.nameFa}</p>
        <p className="text-xs text-[var(--secondary)]">{formatPrice(product.price)}</p>
      </div>
      <div className="flex gap-1">
        <button type="button" onClick={onPrev} className="w-9 h-9 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-sm" aria-label="قبلی">‹</button>
        <button type="button" onClick={onNext} className="w-9 h-9 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-sm" aria-label="بعدی">›</button>
      </div>
    </div>
  );
}
