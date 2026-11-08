"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">سبد خرید</h1>
        <p className="text-[var(--secondary)] mb-8">سبد خریدت خالیه</p>
        <Link
          href="/products"
          className="inline-flex rounded-full bg-[var(--foreground)] px-8 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">سبد خرید</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-[var(--secondary)] hover:text-red-600 transition-colors"
        >
          خالی کردن سبد
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          >
            <div className="relative w-24 h-28 shrink-0 rounded-xl overflow-hidden bg-[var(--muted)]">
              <Image
                src={item.image}
                alt={item.nameFa}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{item.nameFa}</h3>
              <p className="text-sm text-[var(--secondary)] mt-1">
                سایز: {item.size} · رنگ: {item.color}
              </p>
              <p className="font-medium mt-2">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity - 1
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-sm hover:bg-[var(--muted)]"
                >
                  −
                </button>
                <span className="text-sm font-medium w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity + 1
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-sm hover:bg-[var(--muted)]"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                  className="mr-auto text-sm text-red-600 hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-[var(--muted)]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium">جمع کل</span>
          <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
        </div>
        <button
          type="button"
          className="w-full rounded-full bg-[var(--foreground)] py-3.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
        >
          ادامه خرید (به زودی)
        </button>
        <p className="mt-3 text-center text-xs text-[var(--secondary)]">
          درگاه پرداخت در نسخه بعدی اضافه می‌شود
        </p>
      </div>
    </div>
  );
}
