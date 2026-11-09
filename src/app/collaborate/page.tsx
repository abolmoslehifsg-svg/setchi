import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "همکاری | SETCHI",
  description: "همکاری با ستچی — برند، تولید محتوا، سرمایه‌گذاری و پارتنرشیپ",
};

export default function CollaboratePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <p className="text-xs font-medium tracking-widest text-[var(--accent)] uppercase mb-3">Collaborate</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">همکاری با ستچی</h1>
      <p className="mt-4 text-[var(--secondary)] leading-relaxed">
        اگر برند پوشاک، تولیدکننده محتوا، سرمایه‌گذار یا پارتنر بالقوه هستی و می‌خواهی با SETCHI کار کنی،
        مستقیم در تلگرام پیام بده.
      </p>

      <ul className="mt-8 space-y-3 text-sm text-[var(--secondary)]">
        <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> همکاری برند و تأمین محصول</li>
        <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> تولید محتوا و استایلینگ</li>
        <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> سرمایه‌گذاری و شتاب‌دهی</li>
        <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> همکاری فنی و محصول</li>
      </ul>

      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <p className="text-sm text-[var(--secondary)] mb-2">ارتباط مستقیم</p>
        <a
          href="https://t.me/tenmanogod"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold text-[var(--accent)] hover:underline"
          dir="ltr"
        >
          @tenmanogod
        </a>
        <p className="mt-4 text-sm text-[var(--secondary)]">
          در پیام اول، خودت و نوع همکاری پیشنهادی را کوتاه معرفی کن.
        </p>
        <a
          href="https://t.me/tenmanogod"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)]"
        >
          شروع گفتگو در تلگرام
        </a>
      </div>

      <p className="mt-8 text-sm text-[var(--secondary)]">
        بیشتر درباره ما:{" "}
        <Link href="/about/" className="text-[var(--accent)] hover:underline">
          درباره ستچی
        </Link>
      </p>
    </div>
  );
}
