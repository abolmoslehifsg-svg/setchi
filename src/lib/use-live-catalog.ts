"use client";

import { useEffect, useState } from "react";
import { getAllProducts, LiveProduct, products as seedProducts } from "@/data/products";
import { CATALOG_UPDATED_EVENT } from "@/lib/catalog-storage";

/**
 * Seed products on first render (matches the static HTML), then the
 * admin-edited catalog from localStorage once mounted, kept in sync.
 */
export function useLiveCatalog(): { products: LiveProduct[]; ready: boolean } {
  const [state, setState] = useState<{ products: LiveProduct[]; ready: boolean }>({
    products: seedProducts,
    ready: false,
  });

  useEffect(() => {
    const sync = () => setState({ products: getAllProducts(), ready: true });
    sync();
    window.addEventListener(CATALOG_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CATALOG_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}

export function useLiveProduct(id: string): { product?: LiveProduct; ready: boolean } {
  const { products, ready } = useLiveCatalog();
  return { product: products.find((p) => p.id === id), ready };
}
