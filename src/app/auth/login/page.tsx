"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("ایمیل یا رمز عبور اشتباه است");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">ورود به ستچی</h1>
        <p className="mt-2 text-[var(--secondary)]">به حساب کاربریت وارد شو</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">ایمیل</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="email@example.com" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">رمز عبور</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="••••••••" dir="ltr" />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-full bg-[var(--foreground)] py-3.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors disabled:opacity-60">
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-[var(--secondary)]">
        حساب نداری؟{" "}
        <Link href="/auth/register" className="text-[var(--accent)] font-medium hover:underline">ثبت‌نام کن</Link>
      </p>
    </div>
  );
}
