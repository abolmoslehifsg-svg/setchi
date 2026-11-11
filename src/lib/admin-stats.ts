"use client";

export type SaleRecord = {
  id: string;
  productId: string;
  nameFa: string;
  price: number;
  at: number;
};

export type PriceChangeRecord = {
  id: string;
  productId: string;
  nameFa: string;
  from: number;
  to: number;
  delta: number;
  source: "manual" | "discount" | "increase" | "clear-discount";
  at: number;
};

const VISITS_KEY = "setchi_visits_v1";
const SALES_KEY = "setchi_sales_v1";
const ACTIVE_KEY = "setchi_active_ping_v1";
const PRICE_KEY = "setchi_price_changes_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function trackPageVisit() {
  if (typeof window === "undefined") return;
  try {
    const n = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10) || 0;
    localStorage.setItem(VISITS_KEY, String(n + 1));
    localStorage.setItem(ACTIVE_KEY, String(Date.now()));
  } catch {}
}

export function getVisitCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(VISITS_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function recordSale(productId: string, nameFa: string, price: number) {
  if (typeof window === "undefined") return;
  try {
    const list = safeParse<SaleRecord[]>(localStorage.getItem(SALES_KEY), []);
    list.unshift({
      id: `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      productId,
      nameFa,
      price,
      at: Date.now(),
    });
    localStorage.setItem(SALES_KEY, JSON.stringify(list.slice(0, 200)));
  } catch {}
}

export function getSales(): SaleRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse<SaleRecord[]>(localStorage.getItem(SALES_KEY), []);
  } catch {
    return [];
  }
}

export function getSalesSummary() {
  const sales = getSales();
  const byProduct = new Map<string, { nameFa: string; count: number; total: number }>();
  for (const s of sales) {
    const cur = byProduct.get(s.productId) || { nameFa: s.nameFa, count: 0, total: 0 };
    cur.count += 1;
    cur.total += s.price;
    byProduct.set(s.productId, cur);
  }
  const top = Array.from(byProduct.values()).sort((a, b) => b.count - a.count);
  return {
    totalSales: sales.length,
    revenue: sales.reduce((a, s) => a + s.price, 0),
    recent: sales.slice(0, 15),
    top,
  };
}

export function getActiveApprox(): number {
  if (typeof window === "undefined") return 0;
  try {
    const t = parseInt(localStorage.getItem(ACTIVE_KEY) || "0", 10) || 0;
    if (!t) return 0;
    return Date.now() - t < 24 * 60 * 60 * 1000 ? 1 : 0;
  } catch {
    return 0;
  }
}

export function recordPriceChange(entry: {
  productId: string;
  nameFa: string;
  from: number;
  to: number;
  source?: PriceChangeRecord["source"];
}) {
  if (typeof window === "undefined") return;
  if (entry.from === entry.to) return;
  try {
    const list = safeParse<PriceChangeRecord[]>(localStorage.getItem(PRICE_KEY), []);
    list.unshift({
      id: `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      productId: entry.productId,
      nameFa: entry.nameFa,
      from: entry.from,
      to: entry.to,
      delta: entry.to - entry.from,
      source: entry.source || "manual",
      at: Date.now(),
    });
    localStorage.setItem(PRICE_KEY, JSON.stringify(list.slice(0, 300)));
  } catch {}
}

export function getPriceChanges(limit = 50): PriceChangeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse<PriceChangeRecord[]>(localStorage.getItem(PRICE_KEY), []).slice(
      0,
      limit
    );
  } catch {
    return [];
  }
}

export function clearPriceChanges() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PRICE_KEY);
  } catch {}
}
