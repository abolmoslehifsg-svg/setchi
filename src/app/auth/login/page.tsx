"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/user-auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = loginUser(username, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "ورود ناموفق");
      return;
    }
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16" dir="rtl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">ورود</h1>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          به حساب کاربری‌ات وارد شو تا استایل و علاقه‌مندی‌ها ذخیره بمانند.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">نام کاربری</label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="username"
            dir="ltr"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">رمز عبور</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="••••••••"
            dir="ltr"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-cta w-full py-3.5 text-sm disabled:opacity-60"
        >
          {loading ? "..." : "ورود"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--secondary)]">
        حساب نداری؟{" "}
        <Link href="/auth/register/" className="text-link font-medium">
          ثبت‌نام
        </Link>
      </p>
    </div>
  );
}
