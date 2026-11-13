"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession, isAdminLoggedIn } from "@/lib/admin-auth";

const MENU = [
  { href: "/admin/", label: "داشبورد", icon: "⌂" },
  { href: "/admin/products/", label: "محصولات و انبار", icon: "▤" },
  { href: "/admin/categories/", label: "دسته‌بندی‌ها", icon: "☰" },
  { href: "/admin/pricing/", label: "تخفیف و قیمت", icon: "%" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const ok = isAdminLoggedIn();
    setAuthed(ok);
    setReady(true);
    if (!ok) router.replace("/auth/login/");
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--secondary)]" dir="rtl">
        در حال بررسی ورود…
      </div>
    );
  }

  if (!authed) return null;

  const isActive = (href: string) => {
    if (href === "/admin/") {
      return (
        pathname === "/admin" ||
        pathname === "/admin/" ||
        pathname?.endsWith("/admin") ||
        pathname?.endsWith("/admin/")
      );
    }
    return pathname?.includes(href.replace(/\/$/, "")) ?? false;
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]" dir="rtl">
      <aside
        className={`shrink-0 border-l border-[var(--border)] bg-[var(--card)] transition-all ${
          open ? "w-56" : "w-14"
        }`}
      >
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-3">
            {open && <span className="text-sm font-bold">ادمین ستچی</span>}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-sm hover:bg-[var(--muted)]"
              aria-label={open ? "جمع کردن منو" : "باز کردن منو"}
            >
              {open ? "«" : "»"}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-3">
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mx-2 mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  isActive(item.href)
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "hover:bg-[var(--muted)]"
                }`}
                title={item.label}
              >
                <span className="w-5 text-center">{item.icon}</span>
                {open && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
          <div className="border-t border-[var(--border)] p-3 space-y-2">
            <Link
              href="/"
              className="block rounded-xl px-3 py-2 text-xs text-[var(--secondary)] hover:bg-[var(--muted)]"
            >
              {open ? "← بازگشت به سایت" : "⌂"}
            </Link>
            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                router.replace("/auth/login/");
              }}
              className="w-full rounded-xl px-3 py-2 text-xs text-[var(--danger)] hover:bg-[var(--muted)] text-right"
            >
              {open ? "خروج" : "⎋"}
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
