"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  productFavorites: string[];
  toggleFavorite: (outfitId: string) => void;
  isFavorite: (outfitId: string) => boolean;
  toggleProductFavorite: (productId: string) => void;
  isProductFavorite: (productId: string) => boolean;
  recent: string[];
  addRecent: (outfitId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);
const FAV_KEY = "setchi_favorites";
const PRODUCT_FAV_KEY = "setchi_product_favorites";
const RECENT_KEY = "setchi_recent";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [productFavorites, setProductFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const f = localStorage.getItem(FAV_KEY);
      const pf = localStorage.getItem(PRODUCT_FAV_KEY);
      const r = localStorage.getItem(RECENT_KEY);
      if (f) setFavorites(JSON.parse(f));
      if (pf) setProductFavorites(JSON.parse(pf));
      if (r) setRecent(JSON.parse(r));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(PRODUCT_FAV_KEY, JSON.stringify(productFavorites));
  }, [productFavorites, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }, [recent, ready]);

  const toggleFavorite = (outfitId: string) => {
    setFavorites((prev) =>
      prev.includes(outfitId) ? prev.filter((id) => id !== outfitId) : [...prev, outfitId]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleProductFavorite = (productId: string) => {
    setProductFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isProductFavorite = (id: string) => productFavorites.includes(id);

  const addRecent = (outfitId: string) => {
    setRecent((prev) => [outfitId, ...prev.filter((id) => id !== outfitId)].slice(0, 12));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        productFavorites,
        toggleFavorite,
        isFavorite,
        toggleProductFavorite,
        isProductFavorite,
        recent,
        addRecent,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
