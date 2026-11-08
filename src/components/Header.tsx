"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/outfits", label: "استایل‌ها" },
  { href: "/style-assistant", label: "دستیار استایل" },
  { href: "/products", label: "محصولات" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            SETCHI
          </span>
          <span className="hidden sm:inline text-sm text-[var(--secondary)] font-light">
            ستچی
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            aria-label="سبد خرید"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            ورود
          </Link>
          <Link
            href="/style-assistant"
            className="rounded-full bg-[var(--foreground)] px-5 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
          >
            ساخت استایل من
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative p-2" aria-label="سبد خرید">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="p-2 text-[var(--foreground)]"
            onClick={() => setOpen(!open)}
            aria-label="منو"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base font-medium ${
                    active
                      ? "bg-[var(--muted)] text-[var(--accent)]"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
            >
              ورود / ثبت‌نام
            </Link>
            <Link
              href="/style-assistant"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-center text-sm font-medium text-[var(--background)]"
            >
              ساخت استایل من
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
