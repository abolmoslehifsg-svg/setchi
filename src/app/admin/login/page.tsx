"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminCredentials, setAdminSession } from "@/lib/admin-auth";

/**
 * ورود ادمین — فقط با آدرس دستی:
 * https://abolmoslehifsg-svg.github.io/setchi/admin/login/
 * از منوی عمومی لینک نمی‌شود.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const session = checkAdminCredentials(username, password);
    setLoading(false);
    if (!session) {
      setError("نام کاربری یا رمز اشتباه است.");
      return;
    }
    setAdminSession(session);
    router.replace("/admin/");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16" dir="rtl">
      <h1 className="mb-2 text-2xl font-bold">پنل مدیریت</h1>
      <p className="mb-8 text-sm text-[var(--secondary)]">دسترسی محدود</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="نام کاربری"
          dir="ltr"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          dir="ltr"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)] disabled:opacity-60"
        >
          {loading ? "..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
