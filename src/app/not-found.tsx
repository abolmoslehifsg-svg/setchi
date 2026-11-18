"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductById } from "@/data/products";
import { getOutfitByIdLive } from "@/lib/outfits-storage";

function useCatalogRedirect(): boolean {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    try {
      const path = window.location.pathname;

      const pm = path.match(/\/products\/([^/]+)\/?$/);
      if (pm) {
        const seg = decodeURIComponent(pm[1]);
        if (seg !== "view" && getProductById(seg)) {
          setRedirecting(true);
          const base = path.slice(0, pm.index!);
          window.location.replace(
            `${base}/products/view/?id=${encodeURIComponent(seg)}`
          );
          return;
        }
      }

      const om = path.match(/\/outfits\/([^/]+)\/?$/);
      if (om) {
        const seg = decodeURIComponent(om[1]);
        if (seg !== "view" && getOutfitByIdLive(seg)) {
          setRedirecting(true);
          const base = path.slice(0, om.index!);
          window.location.replace(
            `${base}/outfits/view/?id=${encodeURIComponent(seg)}`
          );
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  return redirecting;
}

export default function NotFound() {
  const redirecting = useCatalogRedirect();

  if (redirecting) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-[var(--secondary)]">
        در حال بارگذاری...
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
