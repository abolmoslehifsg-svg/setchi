"use client";

import { useEffect, useState } from "react";
import { formatPrice, getProductById } from "@/data/products";

export function LiveProductPrice({
  productId,
  fallbackPrice,
  className = "text-2xl font-bold",
}: {
  productId: string;
  fallbackPrice: number;
  className?: string;
}) {
  const [price, setPrice] = useState(fallbackPrice);
  const [original, setOriginal] = useState<number | undefined>();

  useEffect(() => {
    const sync = () => {
      const p = getProductById(productId);
      if (!p) return;
      setPrice(p.price);
      setOriginal(p.originalPrice);
    };
    sync();
    window.addEventListener("setchi-catalog-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("setchi-catalog-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [productId]);

  return (
    <div className={className}>
      <span>{formatPrice(price)}</span>
      {original != null && original !== price && (
        <span className="mr-2 text-sm font-normal text-[var(--secondary)] line-through">
          {formatPrice(original)}
        </span>
      )}
    </div>
  );
}
