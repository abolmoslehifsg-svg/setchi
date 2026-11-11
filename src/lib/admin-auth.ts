"use client";

import { ADMIN_CONFIG } from "./admin-config";

export function checkAdminCredentials(username: string, password: string): boolean {
  const u = username.trim().replace(/^@/, "").toLowerCase();
  const p = password;
  return (
    u === ADMIN_CONFIG.username.toLowerCase() &&
    p === ADMIN_CONFIG.password
  );
}

export function setAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ADMIN_CONFIG.sessionKey, "1");
  } catch {}
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ADMIN_CONFIG.sessionKey);
  } catch {}
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ADMIN_CONFIG.sessionKey) === "1";
  } catch {
    return false;
  }
}
