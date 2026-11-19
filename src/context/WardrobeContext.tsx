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
  loadItemsAsync,
  saveItemsAsync,
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
  saveError: string | null;
  addItem: (item: Omit<WardrobeItem, "id" | "createdAt">) => WardrobeItem;
  addItems: (items: Omit<WardrobeItem, "id" | "createdAt">[]) => WardrobeItem[];
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
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadItemsAsync();
      if (cancelled) return;
      setItems(loaded);
      setOutfits(loadOutfits());
      setPrefsState(loadPrefs());
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const res = await saveItemsAsync(items);
      if (cancelled) return;
      if (!res.ok) setSaveError(res.error || "خطای ذخیره");
      else setSaveError(null);
    })();
    return () => {
      cancelled = true;
    };
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

  const addItems = useCallback((batch: Omit<WardrobeItem, "id" | "createdAt">[]) => {
    const now = Date.now();
    const created: WardrobeItem[] = batch.map((data, i) => ({
      ...data,
      id: uid(),
      createdAt: now + i,
    }));
    setItems((prev) => [...created, ...prev]);
    return created;
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
    setOutfits((prev) => {
      const i = prev.findIndex((o) => o.id === outfit.id);
      if (i >= 0) return prev.map((o, idx) => (idx === i ? outfit : o));
      return [outfit, ...prev];
    });
  }, []);

  const removeOutfit = useCallback((id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const setPrefs = useCallback((p: WardrobePrefs) => {
    setPrefsState(p);
  }, []);

  const getItem = useCallback(
    (id: string) => items.find((i) => i.id === id),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      outfits,
      prefs,
      ready,
      saveError,
      addItem,
      addItems,
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
      saveError,
      addItem,
      addItems,
      updateItem,
      removeItem,
      toggleItemFavorite,
      saveOutfit,
      removeOutfit,
      setPrefs,
      getItem,
    ]
  );

  return (
    <WardrobeContext.Provider value={value}>{children}</WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error("useWardrobe must be used within WardrobeProvider");
  return ctx;
}
