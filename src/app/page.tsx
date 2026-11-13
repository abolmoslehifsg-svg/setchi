import Link from "next/link";
import Image from "next/image";
import { OutfitCard } from "@/components/OutfitCard";
import { outfits } from "@/data/outfits";

const categories = [
  {
    id: "streetwear",
    title: "استریت‌ویر",
    desc: "جسارت و راحتی شهری",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  },
  {
    id: "minimalist",
    title: "مینیمال",
    desc: "سادگی با کیفیت بالا",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=600&q=80",
  },
  {
    id: "sporty",
    title: "اسپرتی",
    desc: "انرژی و حرکت",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    id: "casual",
    title: "کژوال",
    desc: "روزمره و همه‌کاره",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  },
];

const steps = [
  {
    num: "۰۱",
    title: "لباس‌هات را ثبت کن",
    desc: "عکس و مشخصات لباس‌های موجود در کمدت را اضافه کن — رنگ، سبک و فصل.",
  },
  {
    num: "۰۲",
    title: "ترکیب بساز",
    desc: "از همان لباس‌ها، ستچی ترکیب‌های هماهنگ برای موقعیت و فصل انتخابی‌ات می‌سازد.",
  },
  {
    num: "۰۳",
    title: "کمبودها را ببین",
    desc: "اگر قطعه‌ای کم داری مشخص می‌شود؛ در صورت نیاز از گالری یا دستیار الهام بگیر.",
  },
];

export default function HomePage() {
  const featured = outfits.slice(0, 4);
  const popular = outfits.slice(2, 6);

  return (
    <div>
      <section className="hero relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <p className="eyebrow mb-5 text-sm">SETCHI · ستچی</p>
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight">
              لباس‌هایی که داری،
              <br className="hidden sm:block" />
              <mark className="hero-mark">استایل‌هایی</mark> که هنوز نساختی.
            </h1>
            <p className="hero-lead mt-6 text-lg leading-relaxed">
              هسته ستچی کمد هوشمند است: لباس‌هایت را ثبت کن و ترکیب واقعی از همان‌ها بساز.
              دستیار استایل و گالری مکمل همین مسیرند.
            </p>
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
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80"
              alt="Fashion hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 320px, 400px"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">استایل‌های منتخب</h2>
            <p className="mt-2 text-[var(--secondary)]">الهام از گالری — مکمل کمد هوشمند</p>
          </div>
          <Link href="/outfits/" className="hidden sm:inline text-sm font-medium text-link hover:underline">
            مشاهده همه ←
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((o, i) => (
            <OutfitCard key={o.id} outfit={o} priority={i < 2} />
          ))}
        </div>
      </section>

      <section className="section-alt py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ستچی چطور کار می‌کنه؟</h2>
            <p className="mt-3 text-[var(--secondary)]">مسیر واقعی استفاده از کمد هوشمند</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.num} className="text-center md:text-right">
                <span className="text-4xl font-light text-link opacity-40">{step.num}</span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-[var(--secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/wardrobe/" className="btn btn-cta inline-flex px-8 py-3.5 text-base">
              باز کردن کمد من
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">دسته‌بندی استایل</h2>
          <p className="mt-2 text-[var(--secondary)]">مسیرهای مختلف برای شروع</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/outfits/?style=${cat.id}`}
              className="cat-card group relative aspect-[4/5] overflow-hidden"
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

      <section className="section-alt py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ترکیب‌های محبوب</h2>
            <p className="mt-2 text-[var(--secondary)]">از گالری — قیمت‌ها از مجموع اجزا</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </div>
      </section>

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
            <p className="eyebrow mb-3">درباره ستچی</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              مد مردانه، ساده‌تر و هوشمندتر
            </h2>
            <p className="mt-6 text-[var(--secondary)] leading-relaxed text-lg">
              SETCHI کمک می‌کند از لباس‌هایی که داری بهتر استفاده کنی و ترکیب‌های کاربردی بسازی.
            </p>
            <Link href="/wardrobe/" className="btn btn-outline mt-8 inline-flex px-7 py-3">
              شروع با کمد من
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
