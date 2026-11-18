"use client";

import { useEffect, useState } from "react";
import {
  APP_BUILD_LABEL,
  APP_VERSION,
  createSnapshot,
  deleteSnapshot,
  exportSnapshotJson,
  fetchGitHubReleases,
  importSnapshotJson,
  loadSnapshots,
  restoreSnapshot,
  type DataSnapshot,
  type GhRelease,
} from "@/lib/updates";

export default function AdminUpdatesPage() {
  const [snaps, setSnaps] = useState<DataSnapshot[]>([]);
  const [releases, setReleases] = useState<GhRelease[]>([]);
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState("");
  const [loadingRel, setLoadingRel] = useState(false);

  const refresh = () => setSnaps(loadSnapshots());

  useEffect(() => {
    refresh();
    setLoadingRel(true);
    fetchGitHubReleases().then((r) => {
      setReleases(r);
      setLoadingRel(false);
    });
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    if (importSnapshotJson(text)) {
      refresh();
      flash("نسخه داده بازیابی شد — یک‌بار رفرش کن");
    } else flash("فایل نامعتبر بود");
  };

  return (
    <div className="space-y-8 max-w-3xl" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">به‌روزرسانی و نسخه‌ها</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          نسخه کد، پشتیبان داده ادمین، انتشارهای گیت‌هاب
        </p>
      </div>
      {msg && (
        <p className="rounded-lg bg-[var(--success-soft)] px-3 py-2 text-sm text-[var(--success)]">{msg}</p>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-2">
        <h2 className="font-bold">نسخه فعلی کد</h2>
        <p className="text-sm">
          <span className="font-mono text-lg" dir="ltr">v{APP_VERSION}</span>
          <span className="text-[var(--secondary)] mr-2">· {APP_BUILD_LABEL}</span>
        </p>
        <p className="text-xs text-[var(--secondary)] leading-relaxed">
          سایت روی GitHub Pages استاتیک است؛ نصب نسخه کد از داخل پنل ممکن نیست و با پوش/Release انجام می‌شود.
          برای برگرداندن داده ادمین (محصول، استایل، محتوا) از پشتیبان زیر استفاده کن.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
        <h2 className="font-bold">پشتیبان / برگرداندن داده</h2>
        <div className="flex flex-wrap gap-2 items-end">
          <label className="text-sm flex-1 min-w-[12rem]">
            برچسب
            <input
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="مثلاً قبل از تخفیف"
            />
          </label>
          <button
            type="button"
            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
            onClick={() => {
              createSnapshot(label.trim() || `پشتیبان ${new Date().toLocaleString("fa-IR")}`);
              setLabel("");
              refresh();
              flash("پشتیبان ذخیره شد");
            }}
          >
            ذخیره نسخه فعلی
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            onClick={() => {
              const blob = new Blob([exportSnapshotJson()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `setchi-backup-${APP_VERSION}.json`;
              a.click();
            }}
          >
            دانلود JSON
          </button>
          <label className="rounded-full border border-[var(--border)] px-4 py-2 text-sm cursor-pointer">
            ایمپورت JSON
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImportFile(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <ul className="divide-y divide-[var(--border)]">
          {snaps.length === 0 && (
            <li className="py-3 text-sm text-[var(--secondary)]">هنوز پشتیبانی نیست.</li>
          )}
          {snaps.map((s) => (
            <li key={s.id} className="py-3 flex flex-wrap items-center gap-2 justify-between">
              <div>
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-[var(--secondary)]" dir="ltr">
                  {new Date(s.createdAt).toLocaleString()} · code v{s.version}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                  onClick={() => {
                    if (confirm("داده فعلی با این پشتیبان جایگزین شود؟")) {
                      restoreSnapshot(s.id);
                      flash("بازیابی شد");
                    }
                  }}
                >
                  نصب دوباره
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                  onClick={() => {
                    const blob = new Blob([exportSnapshotJson(s.id)], { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${s.id}.json`;
                    a.click();
                  }}
                >
                  دانلود
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[var(--danger)] text-[var(--danger)] px-3 py-1 text-xs"
                  onClick={() => {
                    deleteSnapshot(s.id);
                    refresh();
                  }}
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
        <h2 className="font-bold">انتشارهای گیت‌هاب</h2>
        {loadingRel && <p className="text-sm text-[var(--secondary)]">در حال دریافت…</p>}
        {!loadingRel && releases.length === 0 && (
          <p className="text-sm text-[var(--secondary)]">
            هنوز Release ثبت نشده. برای برگشت کد باید روی main کامیت قبلی را بیاوری یا از Actions تگ را دیپلوی کنی.
          </p>
        )}
        <ul className="space-y-3">
          {releases.map((r) => (
            <li key={r.tag_name} className="border border-[var(--border)] rounded-xl p-3">
              <div className="flex justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-medium">{r.name || r.tag_name}</p>
                  <p className="text-xs text-[var(--secondary)]" dir="ltr">
                    {r.tag_name} · {r.published_at?.slice(0, 10)}
                  </p>
                </div>
                <a href={r.html_url} target="_blank" rel="noreferrer" className="text-sm text-[var(--link)] underline">
                  گیت‌هاب
                </a>
              </div>
            </li>
          ))}
        </ul>
        <a
          href="https://github.com/abolmoslehifsg-svg/setchi/releases"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-[var(--link)] underline"
        >
          همه Releases
        </a>
      </section>
    </div>
  );
}
