"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">ثبت‌نام</h1>
      <p className="mt-3 text-sm text-[var(--secondary)] leading-relaxed">
        ثبت‌نام کاربر روی نسخه استاتیک فعال نیست. ورود ادمین از صفحه ورود در دسترس است.
      </p>
      <Link
        href="/auth/login/"
        className="mt-8 inline-block rounded-full bg-[var(--foreground)] px-6 py-3 text-sm text-[var(--background)]"
      >
        رفتن به ورود
      </Link>
    </div>
  );
}
