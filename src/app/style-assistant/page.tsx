"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FashionStyle,
  Occasion,
  ColorPreference,
  BudgetRange,
  Size,
  UserPreferences,
  RecommendationResult,
} from "@/types";
import { generateRecommendations } from "@/lib/recommend";
import { formatPrice } from "@/data/products";

const STEPS = ["سن و استایل", "رنگ و بودجه", "موقعیت و سایز", "نتیجه"];

const styleOptions: { value: FashionStyle; label: string; desc: string }[] = [
  { value: "streetwear", label: "استریت‌ویر", desc: "جسارت شهری و لایه‌بندی" },
  { value: "casual", label: "کژوال", desc: "راحت و همه‌کاره" },
  { value: "sporty", label: "اسپرتی", desc: "فعال و پویا" },
  { value: "minimalist", label: "مینیمال", desc: "ساده و تمیز" },
  { value: "modern", label: "مدرن", desc: "معاصر و refined" },
];

const colorOptions: { value: ColorPreference; label: string }[] = [
  { value: "black", label: "سیاه" },
  { value: "white", label: "سفید" },
  { value: "gray", label: "خاکستری" },
  { value: "beige", label: "بژ" },
  { value: "navy", label: "سرمه‌ای" },
  { value: "olive", label: "زیتونی" },
  { value: "brown", label: "قهوه‌ای" },
  { value: "earth", label: "خاکی" },
];

const occasionOptions: { value: Occasion; label: string }[] = [
  { value: "daily", label: "روزمره" },
  { value: "university", label: "دانشگاه" },
  { value: "party", label: "مهمانی" },
  { value: "casual-outings", label: "گردش و قرار" },
  { value: "work", label: "کار کژوال" },
  { value: "sport", label: "ورزش و فعالیت" },
];

const budgetOptions: { value: BudgetRange; label: string; range: string }[] = [
  { value: "budget", label: "اقتصادی", range: "تا ۵ میلیون" },
  { value: "mid", label: "متوسط", range: "۴ تا ۹ میلیون" },
  { value: "premium", label: "پریمیوم", range: "۷ میلیون به بالا" },
];

const sizeOptions: Size[] = ["S", "M", "L", "XL", "XXL"];

export default function StyleAssistantPage() {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    gender: "male",
    styles: [],
    colors: [],
    occasion: [],
    sizes: {},
  });
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleArray = <T,>(arr: T[] | undefined, item: T): T[] => {
    const current = arr || [];
    return current.includes(item) ? current.filter((x) => x !== item) : [...current, item];
  };

  const canProceed = () => {
    if (step === 0) return (prefs.styles?.length || 0) > 0 && !!prefs.ageRange;
    if (step === 1) return (prefs.colors?.length || 0) > 0 && !!prefs.budget;
    if (step === 2) return (prefs.occasion?.length || 0) > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        const fullPrefs: UserPreferences = {
          gender: "male",
          ageRange: prefs.ageRange || "18-25",
          styles: prefs.styles || ["casual"],
          colors: prefs.colors || ["black"],
          sizes: prefs.sizes || {},
          budget: prefs.budget || "mid",
          occasion: prefs.occasion || ["daily"],
          preferredItems: [],
        };
        setResults(generateRecommendations(fullPrefs, 4));
        setLoading(false);
        setStep(3);
      }, 600);
    }
  };

  const restart = () => {
    setStep(0);
    setResults(null);
    setPrefs({ gender: "male", styles: [], colors: [], occasion: [], sizes: {} });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">دستیار استایل</h1>
        <p className="mt-2 text-[var(--secondary)]">دو راه داری: از کمد خودت، یا از کاتالوگ ستچی</p>
      </div>

      {/* Primary path: own wardrobe */}
      <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
        <p className="text-xs font-medium tracking-widest text-[var(--accent)] uppercase mb-1">پیشنهادی</p>
        <h2 className="font-semibold text-lg">از لباس‌هایی که خودت داری</h2>
        <p className="mt-1 text-sm text-[var(--secondary)] leading-relaxed">
          عکس لباس‌هایت را در کمد آپلود کن؛ بعد فقط از همان‌ها برات ترکیب می‌سازیم.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link
            href="/wardrobe/"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-center text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]"
          >
            آپلود لباس در کمد من
          </Link>
          <Link
            href="/wardrobe/?tab=build"
            className="rounded-full border border-[var(--border)] px-6 py-3 text-center text-sm font-medium hover:bg-[var(--muted)]"
          >
            ساخت استایل از کمد
          </Link>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--secondary)] mb-6">یا با پرسشنامه از کاتالوگ پیشنهاد بگیر</p>

      {step < 3 && (
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            {STEPS.slice(0, 3).map((s, i) => (
              <span key={s} className={`text-xs font-medium ${i <= step ? "text-[var(--accent)]" : "text-[var(--secondary)]"}`}>{s}</span>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
        </div>
      )}

      {step === 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">محدوده سنی</h2>
            <div className="flex flex-wrap gap-3">
              {["18-22", "23-27", "28-32", "33-35"].map((age) => (
                <button key={age} type="button" onClick={() => setPrefs({ ...prefs, ageRange: age })}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium ${prefs.ageRange === age ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)]"}`}>{age}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">استایل‌های مورد علاقه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {styleOptions.map((opt) => {
                const selected = prefs.styles?.includes(opt.value);
                return (
                  <button key={opt.value} type="button" onClick={() => setPrefs({ ...prefs, styles: toggleArray(prefs.styles, opt.value) })}
                    className={`text-right rounded-xl border p-4 ${selected ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)]"}`}>
                    <span className="font-semibold block">{opt.label}</span>
                    <span className="text-sm text-[var(--secondary)]">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">رنگ‌های مورد علاقه</h2>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((opt) => {
                const selected = prefs.colors?.includes(opt.value);
                return (
                  <button key={opt.value} type="button" onClick={() => setPrefs({ ...prefs, colors: toggleArray(prefs.colors, opt.value) })}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium ${selected ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)]"}`}>{opt.label}</button>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">محدوده بودجه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {budgetOptions.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setPrefs({ ...prefs, budget: opt.value })}
                  className={`rounded-xl border p-4 text-center ${prefs.budget === opt.value ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)]"}`}>
                  <span className="font-semibold block">{opt.label}</span>
                  <span className="text-sm text-[var(--secondary)]">{opt.range}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">موقعیت‌های اصلی</h2>
            <div className="flex flex-wrap gap-3">
              {occasionOptions.map((opt) => {
                const selected = prefs.occasion?.includes(opt.value);
                return (
                  <button key={opt.value} type="button" onClick={() => setPrefs({ ...prefs, occasion: toggleArray(prefs.occasion, opt.value) })}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium ${selected ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)]"}`}>{opt.label}</button>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">سایز تقریبی (اختیاری)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[var(--secondary)] mb-2 block">بالا‌تنه</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <button key={s} type="button" onClick={() => setPrefs({ ...prefs, sizes: { ...prefs.sizes, top: s } })}
                      className={`w-12 h-12 rounded-lg text-sm font-medium ${prefs.sizes?.top === s ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)]"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--secondary)] mb-2 block">پایین‌تنه</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <button key={s} type="button" onClick={() => setPrefs({ ...prefs, sizes: { ...prefs.sizes, bottom: s } })}
                      className={`w-12 h-12 rounded-lg text-sm font-medium ${prefs.sizes?.bottom === s ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)]"}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && results && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">پیشنهادهای کاتالوگ</h2>
            <p className="mt-2 text-sm text-[var(--secondary)]">از محصولات نمونه ستچی</p>
          </div>
          <div className="space-y-8">
            {results.map((rec, idx) => (
              <div key={rec.outfit.id} className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="relative aspect-[3/4] sm:min-h-[280px]">
                    <Image src={rec.outfit.image} alt={rec.outfit.titleFa} fill className="object-cover" sizes="50vw" />
                  </div>
                  <div className="p-6 flex flex-col">
                    <span className="text-xs text-[var(--accent)]">#{idx + 1} · تطابق {rec.matchScore}%</span>
                    <h3 className="text-xl font-bold mt-1">{rec.outfit.titleFa}</h3>
                    <p className="mt-2 text-sm text-[var(--secondary)] flex-1">{rec.explanationFa}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-semibold">{formatPrice(rec.outfit.estimatedPrice)}</span>
                      <Link href={`/outfits/${rec.outfit.id}/`} className="text-sm text-[var(--accent)] hover:underline">جزئیات ←</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={restart} className="rounded-full border border-[var(--border)] px-8 py-3 text-sm">شروع دوباره</button>
            <Link href="/wardrobe/" className="rounded-full bg-[var(--foreground)] px-8 py-3 text-center text-sm text-[var(--background)]">حالا از کمد خودت بساز</Link>
          </div>
        </div>
      )}

      {loading && (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="mt-4 text-[var(--secondary)]">در حال ساخت پیشنهادها...</p>
        </div>
      )}

      {step < 3 && !loading && (
        <div className="mt-12 flex justify-between">
          <button type="button" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
            className={`rounded-full px-6 py-2.5 text-sm ${step === 0 ? "opacity-0 pointer-events-none" : "border border-[var(--border)]"}`}>قبلی</button>
          <button type="button" onClick={handleNext} disabled={!canProceed()}
            className={`rounded-full px-8 py-2.5 text-sm font-medium ${canProceed() ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)] text-[var(--secondary)] cursor-not-allowed"}`}>
            {step === 2 ? "دریافت پیشنهادها" : "بعدی"}
          </button>
        </div>
      )}
    </div>
  );
}
