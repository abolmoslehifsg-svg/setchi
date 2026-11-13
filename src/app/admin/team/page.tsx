"use client";

import { useEffect, useState } from "react";
import {
  addAdmin,
  isOwner,
  listAdmins,
  removeAdmin,
  setOwnerPassword,
  updateAdminPassword,
  type AdminAccount,
} from "@/lib/admin-auth";
import { ADMIN_CONFIG } from "@/lib/admin-config";

export default function AdminTeamPage() {
  const [ownerOk, setOwnerOk] = useState(false);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [ownerPass, setOwnerPass] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = () => setAdmins(listAdmins());

  useEffect(() => {
    setOwnerOk(isOwner());
    refresh();
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  if (!ownerOk) {
    return (
      <div className="text-right" dir="rtl">
        <h1 className="text-2xl font-bold">تیم</h1>
        <p className="mt-3 text-sm text-[var(--secondary)]">
          فقط <strong>مالک</strong> می‌تواند ادمین اضافه یا حذف کند.
        </p>
      </div>
    );
  }

  return (
    <div className="text-right max-w-2xl" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">تیم و دسترسی</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          مالک: @{ADMIN_CONFIG.ownerUsername} — فقط شما ادمین جدید می‌سازید.
        </p>
        {msg && <p className="mt-2 text-sm text-[var(--success)]">{msg}</p>}
      </div>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="font-bold mb-3">تغییر رمز مالک</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            value={ownerPass}
            onChange={(e) => setOwnerPass(e.target.value)}
            placeholder="رمز جدید (حداقل ۶)"
            className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            dir="ltr"
          />
          <button
            type="button"
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
            onClick={() => {
              const r = setOwnerPassword(ownerPass);
              if (!r.ok) flash(r.error || "خطا");
              else {
                setOwnerPass("");
                flash("رمز مالک ذخیره شد");
              }
            }}
          >
            ذخیره رمز
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[var(--secondary)]">
          روی این مرورگر ذخیره می‌شود. برای رمز دائمی در سرور، مقدار را در کد admin-config هم عوض کنید.
        </p>
      </section>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="font-bold mb-3">افزودن ادمین</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="نام کاربری"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            dir="ltr"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="رمز (حداقل ۶)"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            dir="ltr"
          />
        </div>
        <button
          type="button"
          className="mt-3 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
          onClick={() => {
            const r = addAdmin(user, pass);
            if (!r.ok) flash(r.error || "خطا");
            else {
              setUser("");
              setPass("");
              refresh();
              flash("ادمین اضافه شد");
            }
          }}
        >
          افزودن
        </button>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h2 className="font-bold">ادمین‌ها ({admins.length})</h2>
        </div>
        {admins.length === 0 ? (
          <p className="p-4 text-sm text-[var(--secondary)]">هنوز ادمینی نیست.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {admins.map((a) => (
              <li
                key={a.username}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-medium" dir="ltr">
                    @{a.username}
                  </div>
                  <div className="text-xs text-[var(--secondary)]">نقش: ادمین</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                    onClick={() => {
                      const np = prompt("رمز جدید ادمین (حداقل ۶):");
                      if (!np) return;
                      const r = updateAdminPassword(a.username, np);
                      flash(r.ok ? "رمز عوض شد" : r.error || "خطا");
                    }}
                  >
                    رمز
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--danger)] text-[var(--danger)] px-3 py-1.5 text-xs"
                    onClick={() => {
                      if (!confirm(`حذف @${a.username}؟`)) return;
                      removeAdmin(a.username);
                      refresh();
                      flash("حذف شد");
                    }}
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
