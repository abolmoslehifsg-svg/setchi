"use client";

import { useEffect, useState } from "react";
import {
  loadOutfits,
  newOutfitId,
  removeOutfit,
  resetOutfitsToBase,
  upsertOutfit,
} from "@/lib/outfits-storage";
import { compressImage } from "@/lib/image";
import { Outfit } from "@/types";
import { formatPrice } from "@/data/products";

const emptyForm = () => ({
  id: "",
  titleFa: "",
  title: "",
  descriptionFa: "",
  image: "",
  estimatedPrice: "0",
  tags: "",
  productIds: "",
});

export default function AdminOutfitsPage() {
  const [list, setList] = useState<Outfit[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(true);

  const refresh = () => setList(loadOutfits());

  useEffect(() => {
    refresh();
  }, []);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2200);
  };

  const onImage = async (file: File | null) => {
    if (!file) return;
    try {
      const data = await compressImage(file, 900, 0.75);
      setForm((f) => ({ ...f, image: data }));
      flash("عکس آماده شد");
    } catch {
      flash("خطا در عکس");
    }
  };

  const save = () => {
    if (!form.titleFa.trim()) {
      flash("عنوان فارسی لازم است");
      return;
    }
    const ids = form.productIds
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const outfit: Outfit = {
      id: form.id || newOutfitId(),
      title: form.title.trim() || form.titleFa.trim(),
      titleFa: form.titleFa.trim(),
      description: form.descriptionFa.trim(),
      descriptionFa: form.descriptionFa.trim(),
      style: ["modern"],
      occasion: ["daily"],
      colors: [],
      image:
        form.image ||
        "https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=900&q=80",
      items: ids.map((productId) => ({ productId, role: "piece" })),
      estimatedPrice: parseInt(form.estimatedPrice.replace(/\D/g, ""), 10) || 0,
      whyItWorks: "",
      whyItWorksFa: form.descriptionFa.trim(),
      tags: form.tags
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setList(upsertOutfit(outfit));
    setForm(emptyForm());
    setEditing(false);
    flash(editing ? "ویرایش شد" : "استایل اضافه شد");
  };

  const startEdit = (o: Outfit) => {
    setEditing(true);
    setForm({
      id: o.id,
      titleFa: o.titleFa,
      title: o.title,
      descriptionFa: o.descriptionFa,
      image: o.image,
      estimatedPrice: String(o.estimatedPrice || 0),
      tags: (o.tags || []).join(", "),
      productIds: o.items.map((i) => i.productId).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-right max-w-4xl" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">استایل‌ها</h1>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            {list.length} استایل · {msg || "افزودن / ویرایش با پیش‌نمایش"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            onClick={() => setPreview((v) => !v)}
          >
            {preview ? "بستن پیش‌نمایش" : "پیش‌نمایش فرم"}
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            onClick={() => {
              if (!confirm("بازگشت به استایل‌های پیش‌فرض؟")) return;
              setList(resetOutfitsToBase());
              flash("بازنشانی شد");
            }}
          >
            بازنشانی
          </button>
        </div>
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-2">
          <h2 className="font-bold mb-2">{editing ? "ویرایش استایل" : "استایل جدید"}</h2>
          <input
            value={form.titleFa}
            onChange={(e) => setForm({ ...form, titleFa: e.target.value })}
            placeholder="عنوان فارسی"
            className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
          />
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="عنوان انگلیسی (اختیاری)"
            className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            dir="ltr"
          />
          <textarea
            value={form.descriptionFa}
            onChange={(e) => setForm({ ...form, descriptionFa: e.target.value })}
            placeholder="توضیح"
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
          />
          <input
            value={form.estimatedPrice}
            onChange={(e) => setForm({ ...form, estimatedPrice: e.target.value })}
            placeholder="قیمت تخمینی"
            className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            dir="ltr"
          />
          <input
            value={form.productIds}
            onChange={(e) => setForm({ ...form, productIds: e.target.value })}
            placeholder="شناسه محصولات (با ویرگول: p1, p2)"
            className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
            dir="ltr"
          />
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="تگ‌ها"
            className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-white"
          />
          <label className="block text-xs text-[var(--secondary)]">
            عکس کاور
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={(e) => onImage(e.target.files?.[0] || null)}
            />
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)]"
            >
              {editing ? "ذخیره تغییرات" : "افزودن"}
            </button>
            {editing && (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm"
                onClick={() => {
                  setEditing(false);
                  setForm(emptyForm());
                }}
              >
                انصراف
              </button>
            )}
          </div>
        </div>

        {preview && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-5">
            <p className="text-xs text-[var(--secondary)] mb-3">پیش‌نمایش کارت</p>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="relative aspect-[3/4] bg-[var(--muted)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    form.image ||
                    "https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=600&q=80"
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 text-right">
                <h3 className="font-semibold">{form.titleFa || "عنوان…"}</h3>
                <p className="mt-1 text-sm text-[var(--secondary)] line-clamp-2">
                  {form.descriptionFa || "توضیح…"}
                </p>
                <p className="mt-3 text-sm font-medium">
                  {formatPrice(parseInt(form.estimatedPrice.replace(/\D/g, ""), 10) || 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <ul className="space-y-2">
        {list.map((o) => (
          <li
            key={o.id}
            className="flex flex-wrap items-center gap-3 justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.image} alt="" className="h-14 w-11 rounded-lg object-cover" />
              <div className="min-w-0 text-right">
                <div className="font-medium truncate">{o.titleFa}</div>
                <div className="text-xs text-[var(--secondary)]">
                  {formatPrice(o.estimatedPrice)} · {o.items.length} آیتم · {o.id}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                onClick={() => startEdit(o)}
              >
                ویرایش
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--danger)] text-[var(--danger)] px-3 py-1.5 text-xs"
                onClick={() => {
                  if (!confirm(`حذف «${o.titleFa}»؟`)) return;
                  setList(removeOutfit(o.id));
                  flash("حذف شد");
                }}
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
