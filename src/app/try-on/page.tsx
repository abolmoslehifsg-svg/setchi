"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getAllProducts, products as seed } from "@/data/products";
import { outfits } from "@/data/outfits";
import { Product } from "@/types";

export default function TryOnPage() {
  const [list, setList] = useState<Product[]>(seed);

  useEffect(() => {
    setList(getAllProducts());
  }, []);

  const tops = useMemo(
    () => list.filter((p) => p.category === "oversized-tshirt" || p.category === "hoodie"),
    [list]
  );
  const bottoms = useMemo(() => list.filter((p) => p.category === "cargo-pants"), [list]);
  const shoes = useMemo(() => list.filter((p) => p.category === "sneakers"), [list]);
  const outer = useMemo(() => list.filter((p) => p.category === "jacket"), [list]);

  const [topIdx, setTopIdx] = useState(0);
  const [bottomIdx, setBottomIdx] = useState(0);
  const [shoeIdx, setShoeIdx] = useState(0);
  const [outerIdx, setOuterIdx] = useState(0);
  const [showOuter, setShowOuter] = useState(true);

  const selected: { role: string; product: Product }[] = [];
  if (showOuter && outer[outerIdx]) selected.push({ role: "رویه", product: outer[outerIdx] });
  if (tops[topIdx]) selected.push({ role: "بالا", product: tops[topIdx] });
  if (bottoms[bottomIdx]) selected.push({ role: "پایین", product: bottoms[bottomIdx] });
  if (shoes[shoeIdx]) selected.push({ role: "کفش", product: shoes[shoeIdx] });

  const total = selected.reduce((s, i) => s + i.product.price, 0);
  const heroImage = outfits[1]?.image || tops[0]?.images[0];
  const cycle = (len: number, idx: number, dir: 1 | -1) =>
    len ? (idx + dir + len) % len : 0;

  return (
    <div className="min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-[var(--accent)] uppercase mb-2">
            تجربی · Experimental
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">پرو مجازی ست</h1>
          <p className="mt-3 text-[var(--secondary)] leading-relaxed">
            پیش‌نمایش تصویری برای ترکیب قطعات لباس. این تجربه شبیه‌سازی واقعی لباس روی بدن نیست.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
              {heroImage && (
                <Image
                  src={heroImage}
                  alt="مدل استایل"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 60vw"
                  priority
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <LayerControl
              label="رویه"
              product={outer[outerIdx]}
              onPrev={() => setOuterIdx((i) => cycle(outer.length, i, -1))}
              onNext={() => setOuterIdx((i) => cycle(outer.length, i, 1))}
              enabled={showOuter}
              onToggle={() => setShowOuter((v) => !v)}
            />
            <LayerControl
              label="بالا"
              product={tops[topIdx]}
              onPrev={() => setTopIdx((i) => cycle(tops.length, i, -1))}
              onNext={() => setTopIdx((i) => cycle(tops.length, i, 1))}
            />
            <LayerControl
              label="پایین"
              product={bottoms[bottomIdx]}
              onPrev={() => setBottomIdx((i) => cycle(bottoms.length, i, -1))}
              onNext={() => setBottomIdx((i) => cycle(bottoms.length, i, 1))}
            />
            <LayerControl
              label="کفش"
              product={shoes[shoeIdx]}
              onPrev={() => setShoeIdx((i) => cycle(shoes.length, i, -1))}
              onNext={() => setShoeIdx((i) => cycle(shoes.length, i, 1))}
            />

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-sm font-medium mb-3">انتخاب فعلی</p>
              <ul className="space-y-2">
                {selected.map((s) => (
                  <li key={s.role} className="flex justify-between gap-2 text-sm">
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
                <Link
                  href="/style-assistant/"
                  className="flex-1 text-center rounded-full bg-[var(--foreground)] py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]"
                >
                  پیشنهاد هوشمند
                </Link>
                <Link
                  href="/outfits/"
                  className="flex-1 text-center rounded-full border border-[var(--border)] py-3 text-sm font-medium hover:bg-[var(--muted)]"
                >
                  گالری استایل
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerControl({
  label,
  product,
  onPrev,
  onNext,
  enabled = true,
  onToggle,
}: {
  label: string;
  product?: Product;
  onPrev: () => void;
  onNext: () => void;
  enabled?: boolean;
  onToggle?: () => void;
}) {
  if (!product) return null;
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 flex items-center gap-3 ${
        !enabled ? "opacity-50" : ""
      }`}
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--muted)] shrink-0">
        <Image
          src={product.images[0]}
          alt={product.nameFa}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs text-[var(--secondary)]">{label}</p>
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="text-[10px] text-[var(--accent)] hover:underline"
            >
              {enabled ? "حذف" : "فعال"}
            </button>
          )}
        </div>
        <p className="font-medium text-sm truncate">{product.nameFa}</p>
        <p className="text-xs text-[var(--secondary)]">{formatPrice(product.price)}</p>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onPrev}
          className="w-9 h-9 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-sm"
          aria-label="قبلی"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-9 h-9 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-sm"
          aria-label="بعدی"
        >
          ›
        </button>
      </div>
    </div>
  );
}
