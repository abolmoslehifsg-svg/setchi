"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  SITE_CONTENT_UPDATED_EVENT,
} from "@/lib/site-content";
import {
  getUserSession,
  logoutUser,
  USER_AUTH_EVENT,
  type UserSession,
} from "@/lib/user-auth";

const PRIMARY = [
  { href: "/", label: "خانه" },
  { href: "/outfits/", label: "استایل‌ها" },
  { href: "/style-assistant/", label: "دستیار" },
  { href: "/wardrobe/", label: "کمد" },
  { href: "/products/", label: "محصولات" },
] as const;

const MORE = [
  { href: "/collections/", label: "کالکشن من" },
  { href: "/favorites/", label: "علاقه‌مندی‌ها" },
  { href: "/try-on/", label: "پرو مجازی" },
] as const;

function pathActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") {
    return (
      pathname === "/" ||
      pathname.endsWith("/setchi") ||
      pathname.endsWith("/setchi/")
    );
  }
  return pathname.includes(href.replace(/\/$/, ""));
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
      />
    </svg>
  );
}

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
      {n > 9 ? "9+" : n}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { favorites, productFavorites } = useFavorites();
  const favCount = favorites.length + productFavorites.length;

  const [brand, setBrand] = useState(DEFAULT_SITE_CONTENT.brandName);
  const [brandFa, setBrandFa] = useState(DEFAULT_SITE_CONTENT.brandNameFa);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const syncBrand = () => {
      const c = loadSiteContent();
      setBrand(c.brandName);
      setBrandFa(c.brandNameFa);
    };
    const syncUser = () => setUser(getUserSession());
    syncBrand();
    syncUser();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, syncBrand);
    window.addEventListener(USER_AUTH_EVENT, syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, syncBrand);
      window.removeEventListener(USER_AUTH_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname?.includes("/admin")) return null;

  const close = () => setMenuOpen(false);
  const name = user?.displayName || user?.username || "";

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span className="brand-mark text-xl font-bold tracking-tight sm:text-2xl">
            {brand}
          </span>
          <span className="brand-sub hidden text-sm xl:inline">{brandFa}</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="اصلی">
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link whitespace-nowrap text-sm font-medium ${
                pathActive(pathname, item.href) ? "nav-link-active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {user ? (
            <div className="ml-1 hidden max-w-[9rem] items-center gap-1.5 md:flex">
              <span className="truncate text-xs font-semibold">{name}</span>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setUser(null);
                }}
                className="rounded-lg px-1.5 py-1 text-[11px] text-[var(--secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                خروج
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login/"
              className="nav-link hidden px-2 py-1.5 text-sm font-medium md:inline"
            >
              ورود
            </Link>
          )}

          <Link
            href="/favorites/"
            className="nav-icon relative p-2"
            aria-label="علاقه‌مندی‌ها"
            title="علاقه‌مندی‌ها"
          >
            <HeartIcon filled={favCount > 0} />
            <Badge n={favCount} />
          </Link>

          <Link href="/cart/" className="nav-icon relative p-2" aria-label="سبد" title="سبد">
            <CartIcon />
            <Badge n={totalItems} />
          </Link>

          <a
            href="/#today-style"
            className="btn btn-cta mr-1 hidden px-4 py-2 text-sm sm:inline-flex"
          >
            استایل امروز
          </a>

          <button
            type="button"
            className="nav-icon p-2 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav lg:hidden">
          <nav className="flex flex-col gap-0.5 px-4 py-4" aria-label="موبایل">
            {user ? (
              <div className="mb-2 rounded-xl bg-[var(--muted)] px-4 py-3 text-sm">
                خوش اومدی، <span className="font-semibold">{name}</span>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setUser(null);
                    close();
                  }}
                  className="mt-2 block text-xs text-[var(--secondary)]"
                >
                  خروج از حساب
                </button>
              </div>
            ) : (
              <div className="mb-3 flex gap-2 px-2">
                <Link
                  href="/auth/login/"
                  onClick={close}
                  className="flex-1 rounded-full border border-[var(--border)] py-2.5 text-center text-sm"
                >
                  ورود
                </Link>
                <Link
                  href="/auth/register/"
                  onClick={close}
                  className="btn btn-cta flex-1 py-2.5 text-center text-sm"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}

            {PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`mobile-nav-link rounded-lg px-4 py-3 text-base font-medium ${
                  pathActive(pathname, item.href) ? "mobile-nav-link-active" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            <p className="px-4 pb-1 pt-3 text-[11px] uppercase tracking-wider text-[var(--secondary)]">
              بیشتر
            </p>
            {MORE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`mobile-nav-link rounded-lg px-4 py-2.5 text-sm ${
                  pathActive(pathname, item.href) ? "mobile-nav-link-active" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            <a
              href="/#today-style"
              onClick={close}
              className="btn btn-cta mt-3 px-5 py-3 text-center"
            >
              استایل امروز من
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
