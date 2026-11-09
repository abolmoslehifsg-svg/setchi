import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما | SETCHI",
  description: "ارتباط با تیم ستچی از طریق تلگرام",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <p className="text-xs font-medium tracking-widest text-[var(--accent)] uppercase mb-3">Contact</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">تماس با ما</h1>
      <p className="mt-4 text-[var(--secondary)] leading-relaxed">
        برای پیشنهاد، گزارش مشکل، سوال درباره محصول یا هر پیام دیگری، از تلگرام پیام بده.
      </p>

      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <p className="text-sm text-[var(--secondary)] mb-2">تلگرام</p>
        <a
          href="https://t.me/tenmanogod"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold text-[var(--accent)] hover:underline"
          dir="ltr"
        >
          @tenmanogod
        </a>
        <p className="mt-4 text-sm text-[var(--secondary)] leading-relaxed">
          معمولاً پیام‌ها را در کوتاه‌ترین زمان ممکن پاسخ می‌دهیم. لطفاً موضوع پیام را واضح بنویس.
        </p>
        <a
          href="https://t.me/tenmanogod"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]"
        >
          پیام در تلگرام
        </a>
      </div>
    </div>
  );
}
