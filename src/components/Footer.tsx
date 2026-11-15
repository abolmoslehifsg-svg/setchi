"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  SITE_CONTENT_UPDATED_EVENT,
  type SiteContent,
} from "@/lib/site-content";

export function Footer() {
  const pathname = usePathname();
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    const sync = () => setC(loadSiteContent());
    sync();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
    return () => window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
  }, []);

  if (pathname?.includes("/admin")) return null;

  return (
    <footer className="site-footer mt-auto bg-[var(--primary)] text-[var(--primary-foreground)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="brand-mark footer-brand text-2xl font-bold tracking-tight">
              {c.brandName}
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">{c.footerBlurb}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">کاوش</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/outfits/" className="text-white/80 hover:text-white">
                  استایل‌ها
                </Link>
              </li>
              <li>
                <Link href="/style-assistant/" className="text-white/80 hover:text-white">
                  دستیار استایل
                </Link>
              </li>
              <li>
                <Link href="/wardrobe/" className="text-white/80 hover:text-white">
                  کمد من
                </Link>
              </li>
              <li>
                <Link href="/products/" className="text-white/80 hover:text-white">
                  محصولات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">درباره</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about/" className="text-white/80 hover:text-white">
                  درباره {c.brandNameFa}
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="text-white/80 hover:text-white">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/collaborate/" className="text-white/80 hover:text-white">
                  همکاری
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">شبکه‌ها</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={c.telegramUrl || "https://t.me/tenmanogod"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  {c.telegramLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} {c.brandName} · {c.brandNameFa}
          </p>
          <p>{c.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}
