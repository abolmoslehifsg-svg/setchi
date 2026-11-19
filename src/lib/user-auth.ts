"use client";

export type UserAccount = {
  username: string;
  password: string;
  displayName: string;
  createdAt: number;
};

export type UserSession = {
  username: string;
  displayName: string;
};

const USERS_KEY = "setchi_users_v1";
const SESSION_KEY = "setchi_user_session_v1";
export const USER_AUTH_EVENT = "setchi-user-auth-changed";

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

function notify() {
  try {
    window.dispatchEvent(new Event(USER_AUTH_EVENT));
  } catch {
    /* ignore */
  }
}

export function listUsers(): UserAccount[] {
  const list = readJson<UserAccount[]>(USERS_KEY, []);
  return Array.isArray(list) ? list.filter((u) => u?.username) : [];
}

export function registerUser(
  username: string,
  password: string,
  displayName?: string
): { ok: boolean; error?: string; session?: UserSession } {
  const u = norm(username);
  const p = password.trim();
  const name = (displayName || username).trim() || u;

  if (!u) return { ok: false, error: "نام کاربری لازم است" };
  if (u.length < 3) return { ok: false, error: "نام کاربری حداقل ۳ کاراکتر باشد" };
  if (!/^[a-z0-9._-]+$/i.test(u)) {
    return { ok: false, error: "فقط حروف لاتین، عدد و . _ - مجاز است" };
  }
  if (p.length < 6) return { ok: false, error: "رمز حداقل ۶ کاراکتر باشد" };

  const list = listUsers();
  if (list.some((a) => norm(a.username) === u)) {
    return { ok: false, error: "این نام کاربری قبلاً ثبت شده" };
  }

  list.push({ username: u, password: p, displayName: name, createdAt: Date.now() });
  writeJson(USERS_KEY, list);

  const session: UserSession = { username: u, displayName: name };
  setUserSession(session);
  return { ok: true, session };
}

export function loginUser(
  username: string,
  password: string
): { ok: boolean; error?: string; session?: UserSession } {
  const u = norm(username);
  const p = password;
  const found = listUsers().find((a) => norm(a.username) === u && a.password === p);
  if (!found) return { ok: false, error: "نام کاربری یا رمز اشتباه است" };

  const session: UserSession = {
    username: found.username,
    displayName: found.displayName || found.username,
  };
  setUserSession(session);
  return { ok: true, session };
}

export function setUserSession(session: UserSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notify();
  } catch {
    /* ignore */
  }
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
    notify();
  } catch {
    /* ignore */
  }
}

export function getUserSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserSession;
    if (!parsed?.username) return null;
    return {
      username: parsed.username,
      displayName: parsed.displayName || parsed.username,
    };
  } catch {
    return null;
  }
}

export function isUserLoggedIn(): boolean {
  return getUserSession() != null;
}

export function logoutUser(): void {
  clearUserSession();
}
