"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession, isAdminLoggedIn } from "@/lib/admin-auth";

const MENU = [
  { href: "/admin/", label: "داشبورد", icon: "⌂" },
  { href: "/admin/products/", label: "محصولات و انبار", icon: "▤" },
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

  useEffect(() => {
    try {
      const v = localStorage.getItem("setchi_admin_sidebar");
      if (v === "0") setOpen(false);
      if (v === "1") setOpen(true);
    } catch {}
  }, []);

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      try {
        localStorage.setItem("setchi_admin_sidebar", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  if (!ready || !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--secondary)]">
        در حال بررسی دسترسی...
      </div>
    );
  }

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
    <div className="min-h-screen bg-[var(--background)] flex" dir="rtl">
      {/* سایدبار — سمت چپ صفحه */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full border-r border-[var(--border)] bg-[var(--card)] transition-all duration-200 flex flex-col ${
          open ? "w-56" : "w-14"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-3 border-b border-[var(--border)]">
          {open && (
            <span className="font-bold text-sm tracking-tight">SETCHI Admin</span>
          )}
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg p-2 text-sm hover:bg-[var(--muted)]"
            aria-label={open ? "جمع کردن منو" : "باز کردن منو"}
            title={open ? "جمع کردن" : "باز کردن"}
          >
            {open ? "«" : "»"}
          </button>
        </div>

        <nav className="flex-1 py-3 space-y-1 px-2">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              title={item.label}
            >
              <span className="w-5 text-center shrink-0">{item.icon}</span>
              {open && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-[var(--border)] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--secondary)] hover:bg-[var(--muted)]"
            title="بازگشت به سایت"
          >
            <span className="w-5 text-center shrink-0">↗</span>
            {open && <span>سایت</span>}
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminSession();
              router.push("/auth/login/");
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
            title="خروج"
          >
            <span className="w-5 text-center shrink-0">⎋</span>
            {open && <span>خروج</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 min-w-0 transition-all duration-200 ${
          open ? "mr-0 ml-56" : "mr-0 ml-14"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
