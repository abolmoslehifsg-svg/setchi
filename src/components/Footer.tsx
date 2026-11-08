import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              SETCHI
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              پلتفرم استایل‌دهی مردانه. استایلت رو پیدا کن، ترکیب کن و بدرخش.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">کاوش</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/outfits" className="text-white/80 hover:text-white">استایل‌ها</Link></li>
              <li><Link href="/style-assistant" className="text-white/80 hover:text-white">دستیار استایل</Link></li>
              <li><Link href="/products" className="text-white/80 hover:text-white">محصولات</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">درباره</h4>
            <ul className="space-y-3 text-sm">
              <li><span className="text-white/80">درباره ستچی</span></li>
              <li><span className="text-white/80">تماس با ما</span></li>
              <li><span className="text-white/80">همکاری</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">شبکه‌های اجتماعی</h4>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white text-sm">اینستاگرام</a>
              <a href="#" className="text-white/60 hover:text-white text-sm">X</a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} SETCHI. تمامی حقوق محفوظ است.</p>
          <p className="text-xs">ساخته شده برای نسل جدید استایل مردانه</p>
        </div>
      </div>
    </footer>
  );
}
