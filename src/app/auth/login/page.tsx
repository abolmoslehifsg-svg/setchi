"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkAdminCredentials, setAdminSession } from "@/lib/admin-auth";

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

    if (checkAdminCredentials(username, password)) {
      setAdminSession();
      setLoading(false);
      router.push("/admin/");
      return;
    }

    setLoading(false);
    setError("نام کاربری یا رمز اشتباه است.");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">ورود</h1>
        <p className="mt-2 text-[var(--secondary)]">ورود ادمین</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">نام کاربری</label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="نام کاربری"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">رمز عبور</label>
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
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--foreground)] py-3.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors disabled:opacity-60"
        >
          {loading ? "..." : "ورود"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--secondary)]">
        حساب نداری؟{" "}
        <Link href="/auth/register/" className="text-[var(--accent)] font-medium hover:underline">
          ثبت‌نام
        </Link>
      </p>
    </div>
  );
}
