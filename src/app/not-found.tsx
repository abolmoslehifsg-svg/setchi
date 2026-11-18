"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductById } from "@/data/products";

/**
 * Admin-added products have no pre-built /products/[id] page on static export.
 * If the URL looks like a product detail and the item exists in localStorage,
 * soft-redirect to the client viewer instead of a dead 404.
 */
function useProductRedirect(): boolean {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    try {
      const path = window.location.pathname;
      const m = path.match(/\/products\/([^/]+)\/?$/);
      if (!m) return;
      const seg = decodeURIComponent(m[1]);
      if (seg === "view") return;
      if (!getProductById(seg)) return;
      setRedirecting(true);
      const base = path.slice(0, m.index!); // e.g. "/setchi" or ""
      window.location.replace(
        `${base}/products/view/?id=${encodeURIComponent(seg)}`
      );
    } catch {
      /* ignore */
    }
  }, []);

  return redirecting;
}

export default function NotFound() {
  const redirecting = useProductRedirect();

  if (redirecting) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-[var(--secondary)]">
        در حال بارگذاری محصول...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-[var(--accent)]">۴۰۴</h1>
      <p className="mt-4 text-xl font-semibold">صفحه پیدا نشد</p>
      <p className="mt-2 text-[var(--secondary)]">
        این صفحه وجود ندارد یا منتقل شده است.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-[var(--foreground)] px-8 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
