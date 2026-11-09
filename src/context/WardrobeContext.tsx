"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { WardrobeItem, WardrobeOutfit, WardrobePrefs } from "@/lib/wardrobe/types";
import {
  loadItems,
  saveItems,
  loadOutfits,
  saveOutfits,
  loadPrefs,
  savePrefs,
  uid,
} from "@/lib/wardrobe/storage";

interface WardrobeContextType {
  items: WardrobeItem[];
  outfits: WardrobeOutfit[];
  prefs: WardrobePrefs;
  ready: boolean;
  addItem: (item: Omit<WardrobeItem, "id" | "createdAt">) => WardrobeItem;
  updateItem: (id: string, patch: Partial<WardrobeItem>) => void;
  removeItem: (id: string) => void;
  toggleItemFavorite: (id: string) => void;
  saveOutfit: (outfit: WardrobeOutfit) => void;
  removeOutfit: (id: string) => void;
  setPrefs: (prefs: WardrobePrefs) => void;
  getItem: (id: string) => WardrobeItem | undefined;
}

const WardrobeContext = createContext<WardrobeContextType | null>(null);

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<WardrobeOutfit[]>([]);
  const [prefs, setPrefsState] = useState<WardrobePrefs>({
    preferredColors: [],
    dislikedColors: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setOutfits(loadOutfits());
    setPrefsState(loadPrefs());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveItems(items);
  }, [items, ready]);

  useEffect(() => {
    if (ready) saveOutfits(outfits);
  }, [outfits, ready]);

  useEffect(() => {
    if (ready) savePrefs(prefs);
  }, [prefs, ready]);

  const addItem = useCallback((data: Omit<WardrobeItem, "id" | "createdAt">) => {
    const item: WardrobeItem = { ...data, id: uid(), createdAt: Date.now() };
    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<WardrobeItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setOutfits((prev) =>
      prev
        .map((o) => ({ ...o, itemIds: o.itemIds.filter((x) => x !== id) }))
        .filter((o) => o.itemIds.length >= 2)
    );
  }, []);

  const toggleItemFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i))
    );
  }, []);

  const saveOutfit = useCallback((outfit: WardrobeOutfit) => {
    setOutfits((prev) => [outfit, ...prev.filter((o) => o.id !== outfit.id)]);
  }, []);

  const removeOutfit = useCallback((id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const setPrefs = useCallback((p: WardrobePrefs) => setPrefsState(p), []);

  const getItem = useCallback((id: string) => items.find((i) => i.id === id), [items]);

  const value = useMemo(
    () => ({
      items,
      outfits,
      prefs,
      ready,
      addItem,
      updateItem,
      removeItem,
      toggleItemFavorite,
      saveOutfit,
      removeOutfit,
      setPrefs,
      getItem,
    }),
    [
      items,
      outfits,
      prefs,
      ready,
      addItem,
      updateItem,
      removeItem,
      toggleItemFavorite,
      saveOutfit,
      removeOutfit,
      setPrefs,
      getItem,
    ]
  );

  return <WardrobeContext.Provider value={value}>{children}</WardrobeContext.Provider>;
}

export function useWardrobe() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error("useWardrobe must be used within WardrobeProvider");
  return ctx;
}
