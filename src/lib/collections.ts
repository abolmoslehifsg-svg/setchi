"use client";

import type { Outfit } from "@/types";

const KEY = "setchi_user_collections_v1";
export const COLLECTIONS_EVENT = "setchi-collections-updated";

export type SavedLook = {
  id: string;
  outfitId: string;
  titleFa: string;
  image: string;
  productIds: string[];
  totalPrice: number;
  savedAt: number;
  note?: string;
};

function notify() {
  try {
    window.dispatchEvent(new Event(COLLECTIONS_EVENT));
  } catch {
    /* ignore */
  }
}

export function loadSavedLooks(): SavedLook[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedLook[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedLooks(list: SavedLook[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  notify();
}

export function isLookSaved(outfitId: string, productIds?: string[]): boolean {
  const looks = loadSavedLooks();
  if (productIds?.length) {
    const key = productIds.join(",");
    return looks.some((l) => l.outfitId === outfitId && l.productIds.join(",") === key);
  }
  return looks.some((l) => l.outfitId === outfitId);
}

export function toggleSaveLook(input: {
  outfit: Outfit;
  productIds: string[];
  totalPrice: number;
}): { saved: boolean; list: SavedLook[] } {
  const list = loadSavedLooks();
  const key = input.productIds.join(",");
  const idx = list.findIndex(
    (l) => l.outfitId === input.outfit.id && l.productIds.join(",") === key
  );
  if (idx >= 0) {
    const next = list.filter((_, i) => i !== idx);
    saveSavedLooks(next);
    return { saved: false, list: next };
  }
  const item: SavedLook = {
    id: `look_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    outfitId: input.outfit.id,
    titleFa: input.outfit.titleFa,
    image: input.outfit.image,
    productIds: input.productIds,
    totalPrice: input.totalPrice,
    savedAt: Date.now(),
  };
  const next = [item, ...list].slice(0, 80);
  saveSavedLooks(next);
  return { saved: true, list: next };
}

export function removeSavedLook(id: string) {
  const next = loadSavedLooks().filter((l) => l.id !== id);
  saveSavedLooks(next);
  return next;
}
