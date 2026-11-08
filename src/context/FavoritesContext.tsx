"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (outfitId: string) => void;
  isFavorite: (outfitId: string) => boolean;
  recent: string[];
  addRecent: (outfitId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);
const FAV_KEY = "setchi_favorites";
const RECENT_KEY = "setchi_recent";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const f = localStorage.getItem(FAV_KEY);
      const r = localStorage.getItem(RECENT_KEY);
      if (f) setFavorites(JSON.parse(f));
      if (r) setRecent(JSON.parse(r));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }, [recent, ready]);

  const toggleFavorite = (outfitId: string) => {
    setFavorites((prev) =>
      prev.includes(outfitId) ? prev.filter((id) => id !== outfitId) : [...prev, outfitId]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addRecent = (outfitId: string) => {
    setRecent((prev) => [outfitId, ...prev.filter((id) => id !== outfitId)].slice(0, 12));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, recent, addRecent }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
