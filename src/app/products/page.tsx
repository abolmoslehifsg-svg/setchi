"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, formatPrice } from "@/data/products";
import { ProductCategory } from "@/types";

const categoryLabels: Record<ProductCategory | "all", string> = {
  all: "همه",
  "oversized-tshirt": "تی‌شرت اورسایز",
  hoodie: "هودی",
  "cargo-pants": "شلوار کارگو",
  jacket: "کاپشن",
  sneakers: "اسنیکرز",
  accessories: "اکسسوری",
};

export default function ProductsPage() {
  const [category, setCategory] = useState<ProductCategory | "all">("all");

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          کاتالوگ محصولات
        </h1>
        <p className="mt-2 text-[var(--secondary)]">
          لباس‌ها و اکسسوری‌هایی که در استایل‌های ستچی استفاده می‌شوند
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
        {(Object.keys(categoryLabels) as (ProductCategory | "all")[]).map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--muted)] hover:bg-[var(--border)]"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          )
        )}
      </div>

      <p className="mb-6 text-sm text-[var(--secondary)]">
        {filtered.length} محصول
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group block overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
              <Image
                src={p.images[0]}
                alt={p.nameFa}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-xs text-[var(--secondary)] mb-1">
                {categoryLabels[p.category]}
              </p>
              <h3 className="font-semibold text-sm sm:text-base group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                {p.nameFa}
              </h3>
              <p className="mt-1.5 text-sm font-medium">
                {formatPrice(p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
