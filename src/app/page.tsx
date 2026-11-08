import Link from "next/link";
import Image from "next/image";
import { OutfitCard } from "@/components/OutfitCard";
import { outfits } from "@/data/outfits";

const categories = [
  {
    id: "streetwear",
    title: "استریت‌ویر",
    desc: "جسارت و راحتی شهری",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  },
  {
    id: "minimalist",
    title: "مینیمال",
    desc: "سادگی با کیفیت بالا",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=600&q=80",
  },
  {
    id: "sporty",
    title: "اسپرتی",
    desc: "انرژی و حرکت",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    id: "casual",
    title: "کژوال",
    desc: "روزمره و همه‌کاره",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  },
];

const steps = [
  {
    num: "۰۱",
    title: "ترجیحاتت رو بگو",
    desc: "استایل، رنگ، بودجه و موقعیت مورد علاقه‌ات را مشخص کن.",
  },
  {
    num: "۰۲",
    title: "پیشنهاد بگیر",
    desc: "دستیار استایل ستچی بر اساس سلیقه‌ات ترکیب‌های مناسب پیشنهاد می‌دهد.",
  },
  {
    num: "۰۳",
    title: "استایلت رو بساز",
    desc: "از گالری الهام بگیر، ست‌ها را ذخیره کن و ظاهر خودت را شکل بده.",
  },
];

export default function HomePage() {
  const featured = outfits.slice(0, 4);
  const popular = outfits.slice(2, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--muted)]">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
            alt="Fashion hero"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--background)] via-[var(--background)]/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-widest text-[var(--accent)] uppercase mb-4">
              SETCHI · ستچی
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-[var(--foreground)]">
              استایلت رو پیدا کن.
            </h1>
            <p className="mt-6 text-lg text-[var(--secondary)] leading-relaxed">
              پلتفرم استایل‌دهی مردانه برای نسل جدید. از استریت‌ویر تا مینیمال —
              ترکیب‌های هوشمند، الهام روزانه و استایلی که واقعاً مال توئه.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/style-assistant"
                className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-8 py-3.5 text-base font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
              >
                ساخت استایل من
              </Link>
              <Link
                href="/outfits"
                className="inline-flex items-center justify-center rounded-full border border-[var(--foreground)] px-8 py-3.5 text-base font-medium text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
              >
                دیدن استایل‌ها
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Outfits */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              استایل‌های منتخب
            </h2>
            <p className="mt-2 text-[var(--secondary)]">
              ترکیب‌هایی که همین الان ترند هستند
            </p>
          </div>
          <Link
            href="/outfits"
            className="hidden sm:inline text-sm font-medium text-[var(--accent)] hover:underline"
          >
            مشاهده همه ←
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((o, i) => (
            <OutfitCard key={o.id} outfit={o} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--muted)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              ستچی چطور کار می‌کنه؟
            </h2>
            <p className="mt-3 text-[var(--secondary)]">
              سه قدم ساده تا استایل شخصی خودت
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.num} className="text-center md:text-right">
                <span className="text-4xl font-light text-[var(--accent)]/40">
                  {step.num}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-[var(--secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/style-assistant"
              className="inline-flex rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              شروع کن
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            دسته‌بندی‌ها
          </h2>
          <p className="mt-2 text-[var(--secondary)]">
            هر استایلی که بخوای، اینجا پیدا می‌کنی
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/outfits?style=${cat.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
                <h3 className="text-lg font-semibold">{cat.title}</h3>
                <p className="text-sm text-white/70 mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular combinations */}
      <section className="bg-[var(--muted)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                ترکیب‌های محبوب
              </h2>
              <p className="mt-2 text-[var(--secondary)]">
                ست‌هایی که بیشترین توجه را جلب کرده‌اند
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand intro */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--muted)]">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="SETCHI brand"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm font-medium tracking-widest text-[var(--accent)] uppercase mb-3">
              درباره ستچی
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              مد مردانه، ساده‌تر و هوشمندتر
            </h2>
            <p className="mt-6 text-[var(--secondary)] leading-relaxed text-lg">
              SETCHI برای مردانی ساخته شده که می‌خواهند بدون اتلاف وقت، استایلی
              پیدا کنند که واقعاً به آن‌ها می‌آید. ما روی استریت‌ویر، کژوال،
              اسپرتی و مینیمال تمرکز داریم — با پیشنهادات هوشمند و الهام بصری
              قوی.
            </p>
            <p className="mt-4 text-[var(--secondary)] leading-relaxed">
              هدف ما این نیست که فقط لباس بفروشیم. می‌خواهیم به تو کمک کنیم
              استایل شخصی‌ات را کشف کنی و با اعتمادبه‌نفس بپوشی.
            </p>
            <Link
              href="/style-assistant"
              className="mt-8 inline-flex rounded-full border border-[var(--foreground)] px-7 py-3 text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
            >
              شروع کشف استایل
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
