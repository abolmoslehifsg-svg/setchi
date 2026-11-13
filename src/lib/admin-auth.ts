"use client";

import { ADMIN_CONFIG } from "./admin-config";

export type AdminRole = "owner" | "admin";

export type AdminAccount = {
  username: string;
  password: string;
  role: AdminRole;
  createdAt: number;
};

export type AdminSession = {
  username: string;
  role: AdminRole;
};

function norm(u: string) {
  return u.trim().replace(/^@/, "").toLowerCase();
}

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
    /* ignore */
  }
}

export function getOwnerPassword(): string {
  const override = readJson<string | null>(ADMIN_CONFIG.ownerPasswordKey, null);
  if (typeof override === "string" && override.length > 0) return override;
  return ADMIN_CONFIG.ownerPassword;
}

export function setOwnerPassword(next: string): { ok: boolean; error?: string } {
  const p = next.trim();
  if (p.length < 6) return { ok: false, error: "رمز حداقل ۶ کاراکتر باشد" };
  writeJson(ADMIN_CONFIG.ownerPasswordKey, p);
  return { ok: true };
}

export function listAdmins(): AdminAccount[] {
  const list = readJson<AdminAccount[]>(ADMIN_CONFIG.adminsKey, []);
  return Array.isArray(list) ? list.filter((a) => a && a.username && a.role === "admin") : [];
}

export function addAdmin(username: string, password: string): { ok: boolean; error?: string } {
  const u = norm(username);
  const p = password.trim();
  if (!u) return { ok: false, error: "نام کاربری لازم است" };
  if (p.length < 6) return { ok: false, error: "رمز حداقل ۶ کاراکتر باشد" };
  if (u === norm(ADMIN_CONFIG.ownerUsername)) {
    return { ok: false, error: "این نام متعلق به مالک است" };
  }
  const list = listAdmins();
  if (list.some((a) => norm(a.username) === u)) {
    return { ok: false, error: "این ادمین از قبل هست" };
  }
  list.push({ username: u, password: p, role: "admin", createdAt: Date.now() });
  writeJson(ADMIN_CONFIG.adminsKey, list);
  return { ok: true };
}

export function removeAdmin(username: string): boolean {
  const u = norm(username);
  const next = listAdmins().filter((a) => norm(a.username) !== u);
  writeJson(ADMIN_CONFIG.adminsKey, next);
  return true;
}

export function updateAdminPassword(username: string, password: string): { ok: boolean; error?: string } {
  const u = norm(username);
  const p = password.trim();
  if (p.length < 6) return { ok: false, error: "رمز حداقل ۶ کاراکتر باشد" };
  const list = listAdmins();
  const i = list.findIndex((a) => norm(a.username) === u);
  if (i < 0) return { ok: false, error: "ادمین پیدا نشد" };
  list[i] = { ...list[i], password: p };
  writeJson(ADMIN_CONFIG.adminsKey, list);
  return { ok: true };
}

export function checkAdminCredentials(
  username: string,
  password: string
): AdminSession | null {
  const u = norm(username);
  const p = password;

  if (u === norm(ADMIN_CONFIG.ownerUsername) && p === getOwnerPassword()) {
    return { username: u, role: "owner" };
  }

  const admin = listAdmins().find((a) => norm(a.username) === u && a.password === p);
  if (admin) return { username: u, role: "admin" };
  return null;
}

export function setAdminSession(session: AdminSession): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ADMIN_CONFIG.sessionKey);
  } catch {
    /* ignore */
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_CONFIG.sessionKey);
    if (!raw) return null;
    if (raw === "1") {
      return { username: norm(ADMIN_CONFIG.ownerUsername), role: "owner" };
    }
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.username || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() != null;
}

export function isOwner(): boolean {
  return getAdminSession()?.role === "owner";
}
