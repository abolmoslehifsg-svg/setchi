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
const VISIT_LOG_KEY = "setchi_visit_log_v1";

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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
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
  const log = readJson<number[]>(VISIT_LOG_KEY, []);
  writeJson(VISIT_LOG_KEY, [Date.now(), ...log].slice(0, 500));
  return n;
}

/** Used by VisitTracker on every public page load. */
export function trackPageVisit() {
  return recordVisit();
}

export function getVisitCount(): number {
  return readJson<number>(VISITS_KEY, 0);
}

/** Approximate "active" sessions in the last 24h from visit timestamps. */
export function getActiveApprox(): number {
  const day = Date.now() - 24 * 60 * 60 * 1000;
  const log = readJson<number[]>(VISIT_LOG_KEY, []);
  return log.filter((t) => typeof t === "number" && t >= day).length;
}

export function getSalesSummary() {
  const sales = getSales(500);
  const revenue = sales.reduce((s, x) => s + x.price, 0);
  const byProduct: Record<string, { nameFa: string; count: number; total: number }> = {};
  for (const s of sales) {
    const cur = byProduct[s.productId] || { nameFa: s.nameFa, count: 0, total: 0 };
    cur.count += 1;
    cur.total += s.price;
    byProduct[s.productId] = cur;
  }
  const top = Object.values(byProduct).sort((a, b) => b.count - a.count);
  return {
    totalSales: sales.length,
    revenue,
    recent: sales.slice(0, 15).map((s) => ({
      nameFa: s.nameFa,
      price: s.price,
      at: s.at,
    })),
    top,
  };
}

export function getDashboardStats() {
  const summary = getSalesSummary();
  return {
    visits: getVisitCount(),
    salesCount: summary.totalSales,
    revenue: summary.revenue,
    topProducts: summary.top.slice(0, 10).map((t) => ({
      id: t.nameFa,
      nameFa: t.nameFa,
      count: t.count,
      revenue: t.total,
    })),
    recentSales: getSales(15),
  };
}
