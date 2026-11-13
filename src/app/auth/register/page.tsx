"use client";

import Link from "next/link";

/** ثبت‌نام عمومی عمداً غیرفعال است تا هر کسی ادمین نشود. */
export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center" dir="rtl">
      <h1 className="text-2xl font-bold">ثبت‌نام عمومی بسته است</h1>
      <p className="mt-4 text-sm text-[var(--secondary)] leading-relaxed">
        برای امنیت، هیچ‌کس نمی‌تواند خودش ادمین شود. فقط{" "}
        <strong>مالک</strong> از پنل ادمین → تیم، حساب ادمین می‌سازد.
      </p>
      <Link
        href="/auth/login/"
        className="mt-8 inline-block rounded-full bg-[var(--foreground)] px-7 py-3 text-sm text-[var(--background)]"
      >
        رفتن به ورود ادمین
      </Link>
    </div>
  );
}
