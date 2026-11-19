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

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/outfits/", label: "استایل‌ها" },
  { href: "/style-assistant/", label: "دستیار استایل" },
  { href: "/try-on/", label: "پرو مجازی" },
  { href: "/wardrobe/", label: "کمد من" },
  { href: "/collections/", label: "کالکشن" },
  { href: "/favorites/", label: "علاقه‌مندی" },
  { href: "/products/", label: "محصولات" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const { favorites, productFavorites } = useFavorites();
  const favCount = favorites.length + productFavorites.length;
  const [brand, setBrand] = useState(DEFAULT_SITE_CONTENT.brandName);
  const [brandFa, setBrandFa] = useState(DEFAULT_SITE_CONTENT.brandNameFa);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const sync = () => {
      const c = loadSiteContent();
      setBrand(c.brandName);
      setBrandFa(c.brandNameFa);
    };
    const syncUser = () => setUser(getUserSession());
    sync();
    syncUser();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
    window.addEventListener(USER_AUTH_EVENT, syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
      window.removeEventListener(USER_AUTH_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  if (pathname?.includes("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname?.endsWith("/setchi") || pathname?.endsWith("/setchi/");
    return pathname?.includes(href.replace(/\/$/, "")) ?? false;
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setOpen(false);
  };

  const welcomeName = user?.displayName || user?.username || "";

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="brand-mark text-2xl font-bold tracking-tight">{brand}</span>
          <span className="brand-sub hidden sm:inline text-sm">{brandFa}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link text-sm font-medium ${isActive(item.href) ? "nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 ml-1">
              <span className="text-sm text-[var(--secondary)] max-w-[10rem] truncate">
                خوش اومدی، <span className="font-semibold text-[var(--foreground)]">{welcomeName}</span>
              </span>
              <button type="button" onClick={handleLogout} className="text-xs text-[var(--secondary)] hover:text-[var(--foreground)] px-2 py-1 rounded-lg hover:bg-[var(--muted)]">خروج</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-1">
              <Link href="/auth/login/" className="nav-link text-sm font-medium px-2 py-1">ورود</Link>
              <Link href="/auth/register/" className="btn btn-outline px-3 py-1.5 text-xs">ثبت‌نام</Link>
            </div>
          )}

          <Link href="/wardrobe/" className="nav-icon relative p-2" aria-label="کمد من">
            <span className="text-sm font-medium">کمد</span>
          </Link>
          <Link href="/favorites/" className="nav-icon relative p-2" aria-label="علاقه‌مندی‌ها">
            <svg className="w-5 h-5" fill={favCount ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {favCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {favCount > 9 ? "9+" : favCount}
              </span>
            )}
          </Link>
          <Link href="/cart/" className="nav-icon relative p-2" aria-label="سبد">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <a href="/#today-style" className="btn btn-cta px-5 py-2">استایل امروز</a>
        </div>

        <button type="button" className="nav-icon md:hidden p-2" onClick={() => setOpen(!open)} aria-label="منو">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mobile-nav md:hidden">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {user && (
              <div className="px-4 py-3 mb-1 rounded-xl bg-[var(--muted)] text-sm">
                خوش اومدی، <span className="font-semibold">{welcomeName}</span>
                <button type="button" onClick={handleLogout} className="block mt-2 text-xs text-[var(--secondary)] hover:text-[var(--foreground)]">خروج از حساب</button>
              </div>
            )}
            {!user && (
              <div className="flex gap-2 px-4 mb-2">
                <Link href="/auth/login/" onClick={() => setOpen(false)} className="flex-1 text-center rounded-full border border-[var(--border)] py-2.5 text-sm">ورود</Link>
                <Link href="/auth/register/" onClick={() => setOpen(false)} className="flex-1 text-center btn btn-cta py-2.5 text-sm">ثبت‌نام</Link>
              </div>
            )}
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`mobile-nav-link rounded-lg px-4 py-3 text-base font-medium ${isActive(item.href) ? "mobile-nav-link-active" : ""}`}>
                {item.label}
              </Link>
            ))}
            <a href="/#today-style" onClick={() => setOpen(false)} className="btn btn-cta mt-2 px-5 py-3 text-center">استایل امروز من</a>
          </nav>
        </div>
      )}
    </header>
  );
}
