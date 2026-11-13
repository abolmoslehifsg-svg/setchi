"use client";

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

export type SaleRecord = {
  id: string;
  productId: string;
  nameFa: string;
  price: number;
  at: number;
};

const PRICE_KEY = "setchi_price_changes_v1";
const SALES_KEY = "setchi_sales_v1";
const VISITS_KEY = "setchi_visits_v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function recordPriceChange(input: {
  productId: string;
  nameFa: string;
  from: number;
  to: number;
  source: PriceChangeRecord["source"];
}) {
  const list = readJson<PriceChangeRecord[]>(PRICE_KEY, []);
  const row: PriceChangeRecord = {
    id: `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    productId: input.productId,
    nameFa: input.nameFa,
    from: input.from,
    to: input.to,
    delta: input.to - input.from,
    source: input.source,
    at: Date.now(),
  };
  writeJson(PRICE_KEY, [row, ...list].slice(0, 200));
}

export function getPriceChanges(limit = 40): PriceChangeRecord[] {
  return readJson<PriceChangeRecord[]>(PRICE_KEY, []).slice(0, limit);
}

export function clearPriceChanges() {
  writeJson(PRICE_KEY, []);
}

export function recordSale(productId: string, nameFa: string, price: number) {
  const list = readJson<SaleRecord[]>(SALES_KEY, []);
  const row: SaleRecord = {
    id: `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    productId,
    nameFa,
    price,
    at: Date.now(),
  };
  writeJson(SALES_KEY, [row, ...list].slice(0, 500));
}

export function getSales(limit = 50): SaleRecord[] {
  return readJson<SaleRecord[]>(SALES_KEY, []).slice(0, limit);
}

export function recordVisit() {
  const n = readJson<number>(VISITS_KEY, 0) + 1;
  writeJson(VISITS_KEY, n);
  return n;
}

export function getVisitCount(): number {
  return readJson<number>(VISITS_KEY, 0);
}

export function getDashboardStats() {
  const sales = getSales(500);
  const revenue = sales.reduce((s, x) => s + x.price, 0);
  const byProduct: Record<string, { nameFa: string; count: number; revenue: number }> = {};
  for (const s of sales) {
    const cur = byProduct[s.productId] || { nameFa: s.nameFa, count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += s.price;
    byProduct[s.productId] = cur;
  }
  const top = Object.entries(byProduct)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  return {
    visits: getVisitCount(),
    salesCount: sales.length,
    revenue,
    topProducts: top,
    recentSales: sales.slice(0, 15),
  };
}
