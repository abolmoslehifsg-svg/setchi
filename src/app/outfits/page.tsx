"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { OutfitCard } from "@/components/OutfitCard";
import { getOutfitTotalPrice } from "@/data/products";
import { loadOutfits, OUTFITS_UPDATED_EVENT } from "@/lib/outfits-storage";
import { getOutfitSeasons, FIT_LABEL_FA, OCCASION_LABEL_FA } from "@/lib/outfit-meta";
import { SEASON_LABEL_FA, type Season } from "@/lib/season";
import { FashionStyle, FitPreference, Occasion, Outfit } from "@/types";

const styleOptions: { value: FashionStyle | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "streetwear", label: "استریت‌ویر" },
  { value: "casual", label: "کژوال" },
  { value: "sporty", label: "اسپرتی" },
  { value: "minimalist", label: "مینیمال" },
  { value: "modern", label: "مدرن" },
];

const occasionOptions: { value: Occasion | "all"; label: string }[] = [
  { value: "all", label: "همه موقعیت‌ها" },
  { value: "daily", label: "روزمره" },
  { value: "university", label: "دانشگاه" },
  { value: "party", label: "مهمانی" },
  { value: "casual-outings", label: "گردش" },
  { value: "work", label: "کار" },
  { value: "sport", label: "ورزش" },
];

const seasonOptions: { value: Season | "all"; label: string }[] = [
  { value: "all", label: "همه فصل‌ها" },
  { value: "spring", label: SEASON_LABEL_FA.spring },
  { value: "summer", label: SEASON_LABEL_FA.summer },
  { value: "fall", label: SEASON_LABEL_FA.fall },
  { value: "winter", label: SEASON_LABEL_FA.winter },
];

const fitOptions: { value: FitPreference | "all"; label: string }[] = [
  { value: "all", label: "همه فرم‌ها" },
  { value: "oversized", label: FIT_LABEL_FA.oversized },
  { value: "regular", label: FIT_LABEL_FA.regular },
  { value: "slim", label: FIT_LABEL_FA.slim },
];

const colorOptions = [
  { value: "all", label: "همه رنگ‌ها" },
  { value: "Black", label: "سیاه" },
  { value: "White", label: "سفید" },
  { value: "Gray", label: "خاکستری" },
  { value: "Beige", label: "بژ" },
  { value: "Olive", label: "زیتونی" },
  { value: "Navy", label: "سرمه‌ای" },
];

const budgetOptions = [
  { value: "all", label: "همه بودجه‌ها" },
  { value: "budget", label: "اقتصادی (کمتر از ۵ م)" },
  { value: "mid", label: "متوسط (۵ تا کمتر از ۸ م)" },
  { value: "premium", label: "پریمیوم (۸ م به بالا)" },
];

export default function OutfitsPage() {
  const [list, setList] = useState<Outfit[]>([]);
  const [style, setStyle] = useState<FashionStyle | "all">("all");
  const [occasion, setOccasion] = useState<Occasion | "all">("all");
  const [season, setSeason] = useState<Season | "all">("all");
  const [fit, setFit] = useState<FitPreference | "all">("all");
  const [color, setColor] = useState("all");
  const [budget, setBudget] = useState("all");

  useEffect(() => {
    const sync = () => setList(loadOutfits());
    sync();
    window.addEventListener(OUTFITS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(OUTFITS_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const oc = q.get("occasion") as Occasion | null;
      const se = q.get("season") as Season | null;
      if (oc && occasionOptions.some((o) => o.value === oc)) setOccasion(oc);
      if (se && seasonOptions.some((o) => o.value === se)) setSeason(se);
    } catch {
      /* ignore */
    }
  }, []);

  const filtered = useMemo(() => {
    return list.filter((o) => {
      if (style !== "all" && !o.style.includes(style)) return false;
      if (occasion !== "all" && !o.occasion.includes(occasion)) return false;
      if (season !== "all" && !getOutfitSeasons(o).includes(season)) return false;
      if (fit !== "all") {
        const f = o.fit || (o.tags?.includes("oversized") ? "oversized" : undefined);
        if (f && f !== fit) return false;
        if (!f && fit !== "regular") return false;
      }
      if (color !== "all" && !o.colors.some((c) => c.includes(color))) return false;
      if (budget !== "all") {
        const total =
          getOutfitTotalPrice(o.items.map((i) => i.productId)) || o.estimatedPrice;
        if (budget === "budget" && total >= 5_000_000) return false;
        if (budget === "mid" && (total < 5_000_000 || total >= 8_000_000)) return false;
        if (budget === "premium" && total < 8_000_000) return false;
      }
      return true;
    });
  }, [list, style, occasion, season, fit, color, budget]);

  const reset = () => {
    setStyle("all");
    setOccasion("all");
    setSeason("all");
    setFit("all");
    setColor("all");
    setBudget("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">گالری استایل‌ها</h1>
          <p className="mt-2 text-[var(--secondary)]">
            فیلتر کن تا دقیقاً همان چیزی که لازم داری را ببینی
          </p>
        </div>
        <Link href="/#today-style" className="text-sm text-link font-medium shrink-0">
          استایل امروز من ←
        </Link>
      </div>

      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-8 bg-[var(--background)]/95 backdrop-blur border-b border-[var(--border)] sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="space-y-3">
          <FilterRow label="موقعیت" options={occasionOptions} value={occasion} onChange={(v) => setOccasion(v as Occasion | "all")} />
          <FilterRow label="فصل" options={seasonOptions} value={season} onChange={(v) => setSeason(v as Season | "all")} />
          <FilterRow label="استایل" options={styleOptions} value={style} onChange={(v) => setStyle(v as FashionStyle | "all")} />
          <FilterRow label="فرم لباس" options={fitOptions} value={fit} onChange={(v) => setFit(v as FitPreference | "all")} />
          <FilterRow label="رنگ" options={colorOptions} value={color} onChange={setColor} />
          <FilterRow label="بودجه" options={budgetOptions} value={budget} onChange={setBudget} />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--secondary)]">
          {filtered.length.toLocaleString("fa-IR")} استایل
          {occasion !== "all" && <span> · {OCCASION_LABEL_FA[occasion as Occasion]}</span>}
        </p>
        <button type="button" onClick={reset} className="text-xs text-[var(--secondary)] hover:text-[var(--foreground)]">
          پاک کردن فیلترها
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)]/40 px-6 py-16 text-center">
          <p className="font-medium mb-2">با این فیلتر چیزی پیدا نشد</p>
          <p className="text-sm text-[var(--secondary)] mb-6">
            فیلتر را ساده‌تر کن یا از مسیر سریع «استایل امروز» استفاده کن.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn btn-outline px-5 py-2.5 text-sm">
              نمایش همه
            </button>
            <Link href="/#today-style" className="btn btn-cta px-5 py-2.5 text-sm">
              استایل امروز من
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o) => (
            <OutfitCard key={o.id} outfit={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium text-[var(--secondary)]">{label}</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              value === o.value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)] hover:bg-[var(--border)]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
