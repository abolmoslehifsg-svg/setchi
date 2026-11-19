"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/user-auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("رمز و تکرار آن یکسان نیست");
      return;
    }

    setLoading(true);
    const res = registerUser(username, password, displayName || username);
    setLoading(false);

    if (!res.ok) {
      setError(res.error || "ثبت‌نام ناموفق");
      return;
    }

    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16" dir="rtl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">ثبت‌نام</h1>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          حساب بساز تا کمد و علاقه‌مندی‌هایت ذخیره شوند.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">نام نمایشی</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="مثلاً علی"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">نام کاربری</label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="ali_style"
            dir="ltr"
          />
          <p className="mt-1 text-xs text-[var(--secondary)]">حداقل ۳ کاراکتر · لاتین</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">رمز عبور</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="حداقل ۶ کاراکتر"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">تکرار رمز</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="••••••••"
            dir="ltr"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-cta w-full py-3.5 text-sm disabled:opacity-60"
        >
          {loading ? "..." : "ثبت‌نام و ورود"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--secondary)]">
        قبلاً ثبت‌نام کردی؟{" "}
        <Link href="/auth/login/" className="text-link font-medium">
          ورود
        </Link>
      </p>
    </div>
  );
}
