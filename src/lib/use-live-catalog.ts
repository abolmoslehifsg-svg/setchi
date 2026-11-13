"use client";

import { useEffect, useState } from "react";
import { getAllProducts, LiveProduct, products as seedProducts } from "@/data/products";
import { CATALOG_UPDATED_EVENT, CATEGORIES_UPDATED_EVENT } from "@/lib/catalog-storage";
import { BUILTIN_CATEGORIES, Category, getAllCategories } from "@/lib/categories";

export function useLiveCatalog(includeDrafts = false): { products: LiveProduct[]; ready: boolean } {
  const [state, setState] = useState<{ products: LiveProduct[]; ready: boolean }>({
    products: seedProducts,
    ready: false,
  });

  useEffect(() => {
    const sync = () => setState({ products: getAllProducts(includeDrafts), ready: true });
    sync();
    window.addEventListener(CATALOG_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CATALOG_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [includeDrafts]);

  return state;
}

export function useLiveProduct(
  id: string,
  includeDrafts = false
): { product?: LiveProduct; ready: boolean } {
  const { products, ready } = useLiveCatalog(includeDrafts);
  return { product: products.find((p) => p.id === id), ready };
}

export function useCategories(): { categories: Category[]; ready: boolean } {
  const [state, setState] = useState<{ categories: Category[]; ready: boolean }>({
    categories: BUILTIN_CATEGORIES,
    ready: false,
  });

  useEffect(() => {
    const sync = () => setState({ categories: getAllCategories(), ready: true });
    sync();
    window.addEventListener(CATEGORIES_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}
