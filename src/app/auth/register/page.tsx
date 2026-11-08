"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message.includes("already") ? "این ایمیل قبلاً ثبت شده" : "خطا در ثبت‌نام");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">ثبت‌نام در ستچی</h1>
        <p className="mt-2 text-[var(--secondary)]">حساب جدید بساز</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">نام</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="نام و نام خانوادگی"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">ایمیل</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="email@example.com"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">رمز عبور</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="حداقل ۶ کاراکتر"
            dir="ltr"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--foreground)] py-3.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors disabled:opacity-60"
        >
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--secondary)]">
        قبلاً ثبت‌نام کردی؟{" "}
        <Link href="/auth/login" className="text-[var(--accent)] font-medium hover:underline">
          وارد شو
        </Link>
      </p>
    </div>
  );
}
