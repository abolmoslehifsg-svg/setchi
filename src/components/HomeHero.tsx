"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  SITE_CONTENT_UPDATED_EVENT,
  type SiteContent,
} from "@/lib/site-content";
import { getUserSession, USER_AUTH_EVENT, type UserSession } from "@/lib/user-auth";

export function HomeHero() {
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const sync = () => setC(loadSiteContent());
    const syncUser = () => setUser(getUserSession());
    sync();
    syncUser();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
    window.addEventListener(USER_AUTH_EVENT, syncUser);
    return () => {
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
      window.removeEventListener(USER_AUTH_EVENT, syncUser);
    };
  }, []);

  return (
    <>
      {user && (
        <div className="bg-[var(--accent)] text-[var(--accent-foreground)] text-center text-sm py-2.5 px-4">
          خوش اومدی، <strong>{user.displayName || user.username}</strong> — آماده‌ای استایل جدید
          بسازی؟
        </div>
      )}
      <section className="hero relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="order-1 lg:order-2 hero-arch relative mx-auto aspect-[4/5] w-full max-w-[16rem] sm:max-w-xs soft-float hero-enter hero-enter-d2">
            <Image
              src={c.heroImage}
              alt={c.brandNameFa || "استایل مردانه"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 320px, 420px"
            />
          </div>

          <div className="order-2 lg:order-1 max-w-xl">
            <p className="eyebrow mb-5 text-sm hero-enter hero-enter-d1">{c.heroEyebrow}</p>
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight hero-enter hero-enter-d2">
              {c.heroTitleLine1}
              <br className="hidden sm:block" />
              <mark className="hero-mark">{c.heroTitleHighlight}</mark> {c.heroTitleLine2}
            </h1>
            <p className="hero-lead mt-6 text-lg leading-relaxed hero-enter hero-enter-d3">
              {c.heroLead}
            </p>
            <div className="mt-10 flex flex-wrap gap-3 hero-enter hero-enter-d4">
              <a href="#today-style" className="btn btn-cta px-8 py-3.5 text-base">
                استایل امروز من
              </a>
              <Link
                href={c.ctaPrimaryHref || "/wardrobe/"}
                className="btn btn-outline px-8 py-3.5 text-base"
              >
                {c.ctaPrimaryLabel || "کمد من"}
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--primary-foreground)]/60 hero-enter hero-enter-d5">
              ۳ قدم · موقعیت · فصل · پیشنهاد آماده
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
