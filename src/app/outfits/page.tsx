"use client";

import { useMemo, useState } from "react";
import { OutfitCard } from "@/components/OutfitCard";
import { outfits } from "@/data/outfits";
import { getOutfitTotalPrice } from "@/data/products";
import { FashionStyle, Occasion } from "@/types";

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

/** Labels must match filter logic exactly */
const budgetOptions = [
  { value: "all", label: "همه بودجه‌ها" },
  { value: "budget", label: "اقتصادی (کمتر از ۵ م)" },
  { value: "mid", label: "متوسط (۵ تا کمتر از ۸ م)" },
  { value: "premium", label: "پریمیوم (۸ م به بالا)" },
];

export default function OutfitsPage() {
  const [style, setStyle] = useState<FashionStyle | "all">("all");
  const [occasion, setOccasion] = useState<Occasion | "all">("all");
  const [color, setColor] = useState("all");
  const [budget, setBudget] = useState("all");

  const filtered = useMemo(() => {
    return outfits.filter((o) => {
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
  }, [style, occasion, color, budget]);

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

      <p className="mb-6 text-sm text-[var(--secondary)]">{filtered.length} استایل پیدا شد</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((o) => (
            <OutfitCard key={o.id} outfit={o} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-[var(--secondary)]">استایلی با این فیلترها پیدا نشد.</p>
          <button
            type="button"
            onClick={() => {
              setStyle("all");
              setOccasion("all");
              setColor("all");
              setBudget("all");
            }}
            className="mt-4 text-[var(--accent)] font-medium hover:underline"
          >
            پاک کردن فیلترها
          </button>
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="text-sm font-medium text-[var(--secondary)] w-16 shrink-0">{label}</span>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
