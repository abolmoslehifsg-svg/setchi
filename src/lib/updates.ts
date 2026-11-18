"use client";

export const APP_VERSION = "2.1.0";
export const APP_BUILD_LABEL = "SETCHI static · GitHub Pages";

const SNAPSHOTS_KEY = "setchi_data_snapshots_v1";

export const DATA_KEYS = [
  "setchi_site_content_v2",
  "setchi_site_content_v1",
  "setchi_catalog_v1",
  "setchi_outfits_v1",
  "setchi_categories_v1",
  "setchi_custom_fonts_v1",
  "setchi_admin_config_v1",
  "setchi_admin_session_v1",
  "setchi_admin_stats_v1",
] as const;

export type DataSnapshot = {
  id: string;
  label: string;
  createdAt: string;
  version: string;
  data: Record<string, string>;
};

export function collectLiveData(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === "undefined") return out;
  for (const k of DATA_KEYS) {
    const v = localStorage.getItem(k);
    if (v != null) out[k] = v;
  }
  return out;
}

export function loadSnapshots(): DataSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DataSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(list: DataSnapshot[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(list.slice(0, 20)));
}

export function createSnapshot(label: string): DataSnapshot {
  const snap: DataSnapshot = {
    id: `snap_${Date.now().toString(36)}`,
    label: label || `پشتیبان ${new Date().toLocaleString("fa-IR")}`,
    createdAt: new Date().toISOString(),
    version: APP_VERSION,
    data: collectLiveData(),
  };
  const list = [snap, ...loadSnapshots()];
  saveSnapshots(list);
  return snap;
}

export function restoreSnapshot(id: string): boolean {
  const snap = loadSnapshots().find((s) => s.id === id);
  if (!snap || typeof window === "undefined") return false;
  for (const [k, v] of Object.entries(snap.data)) {
    localStorage.setItem(k, v);
  }
  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("setchi-site-content-updated"));
    window.dispatchEvent(new Event("setchi-outfits-updated"));
    window.dispatchEvent(new Event("setchi-catalog-updated"));
  } catch {
    /* ignore */
  }
  return true;
}

export function deleteSnapshot(id: string) {
  saveSnapshots(loadSnapshots().filter((s) => s.id !== id));
}

export function exportSnapshotJson(id?: string): string {
  if (id) {
    const s = loadSnapshots().find((x) => x.id === id);
    return JSON.stringify(s ?? createSnapshot("export"), null, 2);
  }
  return JSON.stringify(
    {
      id: "live",
      label: "داده زنده",
      createdAt: new Date().toISOString(),
      version: APP_VERSION,
      data: collectLiveData(),
    },
    null,
    2
  );
}

export function importSnapshotJson(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as DataSnapshot;
    if (!parsed?.data || typeof parsed.data !== "object") return false;
    if (typeof window === "undefined") return false;
    for (const [k, v] of Object.entries(parsed.data)) {
      if (typeof v === "string") localStorage.setItem(k, v);
    }
    try {
      window.dispatchEvent(new Event("setchi-site-content-updated"));
      window.dispatchEvent(new Event("setchi-outfits-updated"));
      window.dispatchEvent(new Event("setchi-catalog-updated"));
    } catch {
      /* ignore */
    }
    return true;
  } catch {
    return false;
  }
}

export type GhRelease = {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body: string;
  prerelease: boolean;
};

export async function fetchGitHubReleases(
  owner = "abolmoslehifsg-svg",
  repo = "setchi"
): Promise<GhRelease[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=15`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as GhRelease[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
