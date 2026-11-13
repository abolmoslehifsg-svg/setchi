"use client";

import { useEffect, useMemo, useState } from "react";
import { OutfitCard } from "@/components/OutfitCard";
import { getOutfitTotalPrice } from "@/data/products";
import { loadOutfits, OUTFITS_UPDATED_EVENT } from "@/lib/outfits-storage";
import { FashionStyle, Occasion, Outfit } from "@/types";

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
  const [color, setColor] = useState("all");
  const [budget, setBudget] = useState("all");

  useEffect(() => {
    const sync = () => setList(loadOutfits());
    sync();
    window.addEventListener(OUTFITS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(OUTFITS_UPDATED_EVENT, sync);
  }, []);

  const filtered = useMemo(() => {
    return list.filter((o) => {
      if (style !== "all" && !o.style.includes(style)) return false;
      if (occasion !== "all" && !o.occasion.includes(occasion)) return false;
      if (color !== "all" && !o.colors.some((c) => c.includes(color))) return false;
      if (budget !== "all") {
        const total = getOutfitTotalPrice(o.items.map((i) => i.productId)) || o.estimatedPrice;
        if (budget === "budget" && total >= 5000000) return false;
        if (budget === "mid" && (total < 5000000 || total >= 8000000)) return false;
        if (budget === "premium" && total < 8000000) return false;
      }
      return true;
    });
  }, [list, style, occasion, color, budget]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">گالری استایل‌ها</h1>
        <p className="mt-2 text-[var(--secondary)]">کشف کن، فیلتر کن و استایل مورد علاقه‌ات را پیدا کن</p>
      </div>

      <div className="mb-10 space-y-4">
        <FilterRow label="استایل" options={styleOptions} value={style} onChange={(v) => setStyle(v as FashionStyle | "all")} />
        <FilterRow label="موقعیت" options={occasionOptions} value={occasion} onChange={(v) => setOccasion(v as Occasion | "all")} />
        <FilterRow label="رنگ" options={colorOptions} value={color} onChange={setColor} />
        <FilterRow label="بودجه" options={budgetOptions} value={budget} onChange={setBudget} />
      </div>

      <p className="mb-6 text-sm text-[var(--secondary)]">{filtered.length} استایل</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((o) => (
          <OutfitCard key={o.id} outfit={o} />
        ))}
      </div>
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
      <p className="mb-2 text-xs font-medium text-[var(--secondary)]">{label}</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
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
