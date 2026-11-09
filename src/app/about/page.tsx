import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ستچی | SETCHI",
  description: "ستچی پلتفرم استایل‌دهی مردانه برای کشف استایل شخصی و استفاده بهتر از لباس‌هایی که داری.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <p className="text-xs font-medium tracking-widest text-[var(--accent)] uppercase mb-3">About</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">درباره ستچی</h1>
      <p className="mt-6 text-[var(--secondary)] leading-relaxed text-lg">
        SETCHI برای مردانی ساخته شده که می‌خواهند بدون اتلاف وقت، استایلی پیدا کنند که واقعاً به آن‌ها می‌آید.
      </p>

      <div className="mt-10 space-y-8 text-[var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">ما چه می‌کنیم؟</h2>
          <p className="text-[var(--secondary)]">
            روی استریت‌ویر، کژوال، اسپرتی و مینیمال تمرکز داریم. با دستیار استایل، گالری ترکیب‌ها و
            <strong className="text-[var(--foreground)]"> کمد هوشمند </strong>
            کمکت می‌کنیم هم از لباس‌هایی که داری بهتر استفاده کنی، هم ترکیب‌های جدید کشف کنی.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">چشم‌انداز</h2>
          <p className="text-[var(--secondary)]">
            هدف ما فقط فروش لباس نیست. می‌خواهیم به تو کمک کنیم استایل شخصی‌ات را بشناسی، با اعتمادبه‌نفس بپوشی
            و در نهایت وقتی آماده خرید بودی، مسیر درستی پیش رویت باشد.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">مخاطب ما</h2>
          <p className="text-[var(--secondary)]">
            مردان ۱۸ تا ۳۵ سال که به مد روز علاقه دارند ولی نمی‌خواهند ساعت‌ها در فروشگاه یا اینستاگرام سردرگم بمانند.
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <Link
          href="/style-assistant/"
          className="rounded-full bg-[var(--foreground)] px-7 py-3 text-center text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]"
        >
          شروع با دستیار استایل
        </Link>
        <Link
          href="/contact/"
          className="rounded-full border border-[var(--border)] px-7 py-3 text-center text-sm font-medium hover:bg-[var(--muted)]"
        >
          تماس با ما
        </Link>
      </div>
    </div>
  );
}
