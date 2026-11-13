"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, isOrderable, LiveProduct, unavailableLabel } from "@/data/products";
import { OrderSource } from "@/lib/order";

type Line = {
  product: LiveProduct;
  size: string;
  color: string;
  quantity: number;
};

type Props = {
  source: OrderSource;
  items: { product: LiveProduct; defaultSize?: string; defaultColor?: string; quantity?: number }[];
  heading?: string;
  single?: boolean;
  includeDrafts?: boolean;
};

export function OrderPanel({
  source,
  items,
  heading,
  single = false,
}: Props) {
  const { addItem } = useCart();
  const [msg, setMsg] = useState("");

  const lines: Line[] = useMemo(
    () =>
      items.map((it) => ({
        product: it.product,
        size: it.defaultSize || it.product.sizes[0] || "M",
        color: it.defaultColor || it.product.colors[0] || "Black",
        quantity: it.quantity || 1,
      })),
    [items]
  );

  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const allOk = lines.every((l) => isOrderable(l.product));

  const addAll = () => {
    if (!allOk) {
      setMsg("برخی اقلام قابل سفارش نیستند");
      return;
    }
    for (const l of lines) {
      addItem({
        productId: l.product.id,
        nameFa: l.product.nameFa,
        price: l.product.price,
        size: l.size,
        color: l.color,
        quantity: l.quantity,
        image: l.product.images[0],
        source,
      });
    }
    setMsg("به سبد اضافه شد");
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-right">
      {heading && <h3 className="font-bold mb-3">{heading}</h3>}
      <ul className="space-y-3 mb-4">
        {lines.map((l) => {
          const bad = unavailableLabel(l.product);
          return (
            <li key={l.product.id} className="flex gap-3 items-center">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]">
                {l.product.images[0] && (
                  <Image src={l.product.images[0]} alt="" fill className="object-cover" sizes="56px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${l.product.id}/`} className="font-medium hover:underline">
                  {l.product.nameFa}
                </Link>
                <p className="text-xs text-[var(--secondary)]">
                  {l.size} · {l.color} · {formatPrice(l.product.price)}
                </p>
                {bad && <p className="text-xs text-[var(--danger)]">{bad}</p>}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <div className="text-sm">
          <span className="text-[var(--secondary)]">جمع: </span>
          <span className="font-bold">{formatPrice(total)}</span>
          {msg && <span className="mr-2 text-xs text-[var(--success)]">{msg}</span>}
        </div>
        <div className="flex gap-2">
          <Link
            href="/cart/"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
          >
            سبد خرید
          </Link>
          <button
            type="button"
            disabled={!allOk}
            onClick={addAll}
            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-40"
          >
            {single ? "افزودن به سبد" : "همه به سبد"}
          </button>
        </div>
      </div>
    </section>
  );
}
