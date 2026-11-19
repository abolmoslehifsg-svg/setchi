"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/user-auth";
import { checkAdminCredentials, setAdminSession } from "@/lib/admin-auth";

type Mode = "user" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "admin") {
      const session = checkAdminCredentials(username, password);
      if (session) {
        setAdminSession(session);
        setLoading(false);
        router.push("/admin/");
        return;
      }
      setLoading(false);
      setError("نام کاربری یا رمز ادمین اشتباه است.");
      return;
    }

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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {mode === "user" ? "ورود" : "ورود ادمین"}
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          {mode === "user"
            ? "به حساب کاربری‌ات وارد شو تا استایلت ذخیره بماند."
            : "فقط مالک و ادمین‌های اضافه‌شده."}
        </p>
      </div>

      <div className="mb-6 flex rounded-full border border-[var(--border)] p-1 bg-[var(--muted)]">
        <button
          type="button"
          onClick={() => {
            setMode("user");
            setError("");
          }}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            mode === "user"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--secondary)]"
          }`}
        >
          کاربر
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("admin");
            setError("");
          }}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            mode === "admin"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--secondary)]"
          }`}
        >
          ادمین
        </button>
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
            placeholder="username"
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
          className="btn btn-cta w-full py-3.5 text-sm disabled:opacity-60"
        >
          {loading ? "..." : "ورود"}
        </button>
      </form>

      {mode === "user" && (
        <p className="mt-8 text-center text-sm text-[var(--secondary)]">
          حساب نداری؟{" "}
          <Link href="/auth/register/" className="text-link font-medium">
            ثبت‌نام
          </Link>
        </p>
      )}
    </div>
  );
}
