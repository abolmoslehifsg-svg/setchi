"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/outfits/", label: "استایل‌ها" },
  { href: "/style-assistant/", label: "دستیار استایل" },
  { href: "/try-on/", label: "پرو مجازی" },
  { href: "/products/", label: "محصولات" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const { favorites } = useFavorites();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname?.endsWith("/setchi") || pathname?.endsWith("/setchi/");
    return pathname?.includes(href.replace(/\/$/, "")) ?? false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold tracking-tight group-hover:text-[var(--accent)]">SETCHI</span>
          <span className="hidden sm:inline text-sm text-[var(--secondary)]">ستچی</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm font-medium ${isActive(item.href) ? "text-[var(--accent)]" : "text-[var(--secondary)] hover:text-[var(--foreground)]"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/outfits/" className="relative p-2 text-[var(--secondary)] hover:text-[var(--accent)]" aria-label="علاقه‌مندی‌ها">
            <svg className="w-5 h-5" fill={favorites.length ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {favorites.length > 0 && <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">{favorites.length > 9 ? "9+" : favorites.length}</span>}
          </Link>
          <Link href="/cart/" className="relative p-2 text-[var(--secondary)] hover:text-[var(--accent)]" aria-label="سبد خرید">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {totalItems > 0 && <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">{totalItems > 9 ? "9+" : totalItems}</span>}
          </Link>
          <Link href="/auth/login/" className="text-sm font-medium text-[var(--secondary)] hover:text-[var(--foreground)] px-2">ورود</Link>
          <Link href="/style-assistant/" className="rounded-full bg-[var(--foreground)] px-5 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]">استایل منو بساز</Link>
        </div>

        <button type="button" className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="منو">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-lg px-4 py-3 text-base font-medium ${isActive(item.href) ? "bg-[var(--muted)] text-[var(--accent)]" : "hover:bg-[var(--muted)]"}`}>
                {item.label}
              </Link>
            ))}
            <Link href="/style-assistant/" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-center text-sm font-medium text-[var(--background)]">استایل منو بساز</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
