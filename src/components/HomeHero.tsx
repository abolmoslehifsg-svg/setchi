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

export function HomeHero() {
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    const sync = () => setC(loadSiteContent());
    sync();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
    return () => window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
  }, []);

  return (
    <section className="hero relative overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
        <div className="max-w-xl">
          <p className="eyebrow mb-5 text-sm">{c.heroEyebrow}</p>
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight">
            {c.heroTitleLine1}
            <br className="hidden sm:block" />
            <mark className="hero-mark">{c.heroTitleHighlight}</mark> {c.heroTitleLine2}
          </h1>
          <p className="hero-lead mt-6 text-lg leading-relaxed">{c.heroLead}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/wardrobe/" className="btn btn-cta px-8 py-3.5 text-base">
              شروع با کمد من
            </Link>
            <Link href="/style-assistant/" className="btn btn-outline px-8 py-3.5 text-base">
              دستیار استایل
            </Link>
          </div>
        </div>

        <div className="hero-arch relative mx-auto aspect-[4/5] w-full max-w-[17rem] sm:max-w-xs">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80"
            alt="استایل مردانه"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 320px, 400px"
          />
        </div>
      </div>
    </section>
  );
}
