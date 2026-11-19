"use client";

import { getAllProducts, getProductById, type LiveProduct } from "@/data/products";

const ROLE_TO_CATEGORY_HINT: Record<string, string[]> = {
  top: ["oversized-tshirt", "hoodie", "tshirt", "shirt"],
  bottom: ["cargo-pants", "pants", "jeans", "shorts"],
  footwear: ["sneakers", "shoes"],
  outer: ["jacket"],
  accessory: ["accessories"],
};

export function getAlternatives(
  productId: string,
  role: string,
  limit = 4
): LiveProduct[] {
  const current = getProductById(productId);
  const all = getAllProducts().filter((p) => p.id !== productId && p.inStock !== false);
  const hints = ROLE_TO_CATEGORY_HINT[role] || [];

  const scored = all.map((p) => {
    let score = 0;
    if (current && p.category === current.category) score += 40;
    if (hints.some((h) => p.category.includes(h) || h.includes(p.category))) score += 25;
    if (current && p.colors?.some((c) => current.colors?.includes(c))) score += 12;
    if (current && Math.abs(p.price - current.price) < current.price * 0.35) score += 10;
    return { p, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export function liveOutfitTotal(productIds: string[]): number {
  return productIds.reduce((sum, id) => {
    const p = getProductById(id);
    return sum + (p?.price ?? 0);
  }, 0);
}
