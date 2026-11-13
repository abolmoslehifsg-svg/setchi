"use client";

import { outfits as baseOutfits } from "@/data/outfits";
import { Outfit } from "@/types";

export const OUTFITS_STORAGE_KEY = "setchi_outfits_v1";
export const OUTFITS_UPDATED_EVENT = "setchi-outfits-updated";

function notify() {
  try {
    window.dispatchEvent(new Event(OUTFITS_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

export function loadOutfits(): Outfit[] {
  if (typeof window === "undefined") return baseOutfits;
  try {
    const raw = localStorage.getItem(OUTFITS_STORAGE_KEY);
    if (!raw) return baseOutfits;
    const parsed = JSON.parse(raw) as Outfit[];
    if (!Array.isArray(parsed) || !parsed.length) return baseOutfits;
    return parsed;
  } catch {
    return baseOutfits;
  }
}

export function saveOutfits(list: Outfit[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(list));
  notify();
}

export function getOutfitByIdLive(id: string): Outfit | undefined {
  return loadOutfits().find((o) => o.id === id);
}

export function upsertOutfit(outfit: Outfit): Outfit[] {
  const list = loadOutfits();
  const i = list.findIndex((o) => o.id === outfit.id);
  const next =
    i >= 0 ? list.map((o, idx) => (idx === i ? outfit : o)) : [outfit, ...list];
  saveOutfits(next);
  return next;
}

export function removeOutfit(id: string): Outfit[] {
  const next = loadOutfits().filter((o) => o.id !== id);
  saveOutfits(next);
  return next;
}

export function resetOutfitsToBase(): Outfit[] {
  saveOutfits(baseOutfits);
  return baseOutfits;
}

export function newOutfitId() {
  return `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
