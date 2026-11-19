"use client";

import Image from "next/image";
import Link from "next/link";
import { OutfitCard } from "@/components/OutfitCard";
import { OrderPanel } from "@/components/OrderPanel";
import { outfits } from "@/data/outfits";
import { formatPrice, isOrderable } from "@/data/products";
import { categoryLabel } from "@/lib/categories";
import { useLiveProduct } from "@/lib/use-live-catalog";

export function ProductDetail({
  id,
  includeDrafts = true,
}: {
  id: string;
  includeDrafts?: boolean;
}) {
  const { product, ready } = useLiveProduct(id, includeDrafts);

  if (!product) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-[var(--secondary)]">
          {ready ? "محصول پیدا نشد." : "در حال بارگذاری..."}
        </p>
        {ready && (
          <Link
            href="/products/"
            className="mt-6 inline-block rounded-full border border-[var(--border)] px-7 py-3 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
          >
            بازگشت به کاتالوگ
          </Link>
        )}
      </div>
    );
  }

  const soldOut = !isOrderable(product);
  const hasDiscount =
    product.originalPrice != null && product.originalPrice !== product.price;
  const relatedOutfits = outfits.filter((o) =>
    o.items.some((item) => item.productId === product.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--muted)]">
          <Image
            src={product.images[0]}
            alt={product.nameFa}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="text-sm text-[var(--accent)] font-medium">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {product.nameFa}
          </h1>
          <p className="mt-1 text-[var(--secondary)]">{product.name}</p>

          <div className="mt-6 text-2xl font-bold">
            <span>{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="mr-2 text-sm font-normal text-[var(--secondary)] line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            {soldOut && (
              <span className="mr-3 rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium text-red-600">
                ناموجود
              </span>
            )}
          </div>

          {product.descriptionFa && (
            <p className="mt-6 text-[var(--secondary)] leading-relaxed">
              {product.descriptionFa}
            </p>
          )}

          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">سایزهای موجود</h3>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="min-w-11 h-11 px-3 flex items-center justify-center rounded-lg border border-[var(--border)] text-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">رنگ‌ها</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span key={c} className="rounded-full bg-[var(--muted)] px-3 py-1 text-sm">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm space-y-3">
            <div>
              <h3 className="font-medium mb-1">جنس و جزئیات</h3>
              <p className="text-[var(--secondary)] text-xs leading-relaxed">
                {product.tags?.length
                  ? `برچسب‌ها: ${product.tags.join(" · ")}`
                  : "جزئیات پارچه توسط فروشنده تکمیل می‌شود."}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">راهنمای سایز (تقریبی)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse" dir="ltr">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-1.5 px-2">Size</th>
                      <th className="py-1.5 px-2">سینه (cm)</th>
                      <th className="py-1.5 px-2">کمر (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--secondary)]">
                    <tr className="border-b border-[var(--border)]/50"><td className="py-1">S</td><td>88–92</td><td>72–76</td></tr>
                    <tr className="border-b border-[var(--border)]/50"><td className="py-1">M</td><td>92–96</td><td>76–80</td></tr>
                    <tr className="border-b border-[var(--border)]/50"><td className="py-1">L</td><td>96–100</td><td>80–84</td></tr>
                    <tr className="border-b border-[var(--border)]/50"><td className="py-1">XL</td><td>100–106</td><td>84–90</td></tr>
                    <tr><td className="py-1">XXL</td><td>106–112</td><td>90–96</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-[var(--secondary)] mt-2">
                جدول عمومی است. برای شلوار و کفش به سایزهای روی کارت مراجعه کن.
              </p>
            </div>
            <p className="text-[11px] text-[var(--secondary)]">
              موجودی: {soldOut ? "ناموجود" : product.stock != null ? `${product.stock} عدد` : "موجود"}
              {" · "}ارسال و مرجوعی هنگام ثبت سفارش با فروشنده هماهنگ می‌شود.
            </p>
          </div>

          <div className="mt-10">
            <OrderPanel
              source={{ kind: "product", id: product.id, title: product.nameFa }}
              items={[
                {
                  product,
                  defaultSize: product.sizes[0],
                  defaultColor: product.colors[0],
                },
              ]}
              heading="سفارش این محصول"
              single
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/style-assistant/"
              className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
            >
              پیدا کردن استایل با این محصول
            </Link>
            <Link
              href="/products/"
              className="rounded-full border border-[var(--border)] px-7 py-3 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
            >
              بازگشت به کاتالوگ
            </Link>
          </div>
        </div>
      </div>

      {relatedOutfits.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold mb-8">استایل‌هایی که این محصول در آن‌ها هست</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedOutfits.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
