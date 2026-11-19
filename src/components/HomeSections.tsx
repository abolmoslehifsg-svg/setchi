"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OutfitCard } from "@/components/OutfitCard";
import { Reveal } from "@/components/Reveal";
import { outfits } from "@/data/outfits";
import {
  DEFAULT_SITE_CONTENT,
  loadSiteContent,
  SITE_CONTENT_UPDATED_EVENT,
  type SiteContent,
} from "@/lib/site-content";
import { loadOutfits, OUTFITS_UPDATED_EVENT } from "@/lib/outfits-storage";
import type { Outfit } from "@/types";

export function HomeSections() {
  const [c, setC] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [liveOutfits, setLiveOutfits] = useState<Outfit[]>(outfits);

  useEffect(() => {
    const sync = () => setC(loadSiteContent());
    const syncO = () => {
      try {
        setLiveOutfits(loadOutfits());
      } catch {
        setLiveOutfits(outfits);
      }
    };
    sync();
    syncO();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
    window.addEventListener(OUTFITS_UPDATED_EVENT, syncO);
    return () => {
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
      window.removeEventListener(OUTFITS_UPDATED_EVENT, syncO);
    };
  }, []);

  const featured = liveOutfits.slice(0, 4);
  const popular = liveOutfits.slice(2, 6);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.featuredTitle}</h2>
              <p className="mt-2 text-[var(--secondary)]">{c.featuredSubtitle}</p>
            </div>
            <Link href="/outfits/" className="hidden sm:inline text-sm font-medium text-link hover:underline">
              مشاهده همه ←
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((o, i) => (
            <Reveal key={o.id} delay={i * 70}>
              <OutfitCard outfit={o} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-alt py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.stepsTitle}</h2>
              <p className="mt-3 text-[var(--secondary)]">{c.stepsSubtitle}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {c.steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 90}>
                <div className="step-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 h-full">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-bold">
                    {s.num}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-[var(--secondary)] leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal>
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.categoriesTitle}</h2>
            <p className="mt-2 text-[var(--secondary)]">{c.categoriesSubtitle}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(c.categories || []).map((cat, i) => (
            <Reveal key={cat.id} delay={i * 80}>
              <Link
                href={cat.href || "/outfits/"}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/5] hover-lift"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
                  <h3 className="text-lg font-semibold">{cat.title}</h3>
                  <p className="text-sm text-white/70 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-alt py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.popularTitle}</h2>
              <p className="mt-2 text-[var(--secondary)]">{c.popularSubtitle}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((o, i) => (
              <Reveal key={o.id} delay={i * 70}>
                <OutfitCard outfit={o} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--muted)] hover-lift">
              <Image
                src={c.aboutImage}
                alt={c.brandName}
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="eyebrow mb-3">{c.aboutEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                {c.aboutTitle}
              </h2>
              <p className="mt-6 text-[var(--secondary)] leading-relaxed text-lg">{c.aboutBody}</p>
              <Link
                href={c.aboutCtaHref || "/wardrobe/"}
                className="btn btn-outline mt-8 inline-flex px-7 py-3"
              >
                {c.aboutCtaLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
