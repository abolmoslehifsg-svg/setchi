"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWardrobe } from "@/context/WardrobeContext";
import {
  CATEGORY_LABELS, COLOR_OPTIONS, WardrobeCategory, WardrobeFit,
  WardrobeItem, WardrobeOccasion, WardrobeSeason, WardrobeStyle, WardrobePattern,
} from "@/lib/wardrobe/types";
import {
  compressImage,
  compressImageBulk,
  estimateStorageMb,
  WARDROBE_SOFT_LIMIT,
} from "@/lib/wardrobe/storage";
import {
  analyzeMissing, generateFromWardrobe, toSavedOutfit,
  replaceItemInOutfit, scoreOutfitItems, GeneratedOutfit,
} from "@/lib/wardrobe/engine";

type Tab = "items" | "build" | "saved" | "missing";

export default function WardrobePage() {
  const w = useWardrobe();
  const [tab, setTab] = useState<Tab>("items");
  const [showAdd, setShowAdd] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WardrobeCategory>("tshirt");
  const [mainColor, setMainColor] = useState("black");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [style, setStyle] = useState<WardrobeStyle>("casual");
  const [fit, setFit] = useState<WardrobeFit>("regular");
  const [season, setSeason] = useState<WardrobeSeason>("all");
  const [pattern, setPattern] = useState<WardrobePattern>("solid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [generated, setGenerated] = useState<GeneratedOutfit[]>([]);
  const [active, setActive] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const bulkRef = useRef<HTMLInputElement>(null);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [bulkMsg, setBulkMsg] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<WardrobeCategory>("tshirt");
  const [bulkColor, setBulkColor] = useState("black");
  const [bulkStyle, setBulkStyle] = useState<WardrobeStyle>("casual");
  const [bulkFit, setBulkFit] = useState<WardrobeFit>("regular");
  const [bulkSeason, setBulkSeason] = useState<WardrobeSeason>("all");
  const [lastBulkIds, setLastBulkIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "build" || t === "saved" || t === "missing" || t === "items") setTab(t);
    } catch {}
  }, []);

  const missing = useMemo(() => analyzeMissing(w.items), [w.items]);
  const current = generated[active];

  const onFile = async (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) { setError("فقط تصویر"); return; }
    setBusy(true); setError("");
    try {
      const data = await compressImage(file);
      setPreview(data);
      if (!name) setName(file.name.replace(/\.[^.]+$/, "").slice(0, 40));
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally { setBusy(false); }
  };

  const onBulkFiles = async (list: FileList | null) => {
    if (!list || !list.length) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      setError("هیچ تصویری انتخاب نشد");
      return;
    }
    if (w.items.length + files.length > WARDROBE_SOFT_LIMIT) {
      setError(`حد پیشنهادی ${WARDROBE_SOFT_LIMIT} لباس است. الان ${w.items.length} داری.`);
    }
    setBusy(true);
    setError("");
    setBulkMsg("");
    setBulkProgress({ done: 0, total: files.length });
    const batch: Omit<WardrobeItem, "id" | "createdAt">[] = [];
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        const data = await compressImageBulk(files[i]);
        const base = files[i].name.replace(/\.[^.]+$/, "").slice(0, 40) || `لباس ${i + 1}`;
        batch.push({
          imageData: data,
          name: base,
          category: bulkCategory,
          mainColor: bulkColor,
          secondaryColors: [],
          pattern: "solid",
          style: bulkStyle,
          season: bulkSeason,
          fit: bulkFit,
          favorite: false,
        });
      } catch {
        failed += 1;
      }
      setBulkProgress({ done: i + 1, total: files.length });
    }
    let created: WardrobeItem[] = [];
    if (batch.length) created = w.addItems(batch);
    setLastBulkIds(created.map((x) => x.id));
    const catLabel = CATEGORY_LABELS[bulkCategory];
    setBulkMsg(
      failed
        ? `${batch.length} ${catLabel} اضافه شد · ${failed} ناموفق — می‌تونی هر کدام را ویرایش کنی`
        : `${batch.length} ${catLabel} اضافه شد — روی «ویرایش» بزن و جزئیات را عوض کن`
    );
    setBusy(false);
    setBulkProgress(null);
    setShowBulk(false);
    setTab("items");
    if (bulkRef.current) bulkRef.current.value = "";
  };

  const startBulkPick = () => {
    setShowBulk(false);
    setTimeout(() => bulkRef.current?.click(), 80);
  };

  const resetForm = () => {
    setPreview(null); setName(""); setCategory("tshirt"); setMainColor("black");
    setSecondaryColor(""); setStyle("casual"); setFit("regular"); setSeason("all");
    setPattern("solid"); setEditingId(null); setError("");
  };

  const openEdit = (item: WardrobeItem) => {
    setEditingId(item.id); setPreview(item.imageData); setName(item.name);
    setCategory(item.category); setMainColor(item.mainColor);
    setSecondaryColor(item.secondaryColors?.[0] || "");
    setStyle(item.style); setFit(item.fit); setSeason(item.season); setPattern(item.pattern);
    setShowAdd(true);
  };

  const submit = () => {
    if (!preview || !name.trim()) { setError("تصویر و نام لازم است"); return; }
    const payload = {
      imageData: preview, name: name.trim(), category, mainColor,
      secondaryColors: secondaryColor ? [secondaryColor] : [],
      pattern, style, season, fit, favorite: false as boolean,
    };
    if (editingId) w.updateItem(editingId, payload);
    else w.addItem(payload);
    setShowAdd(false); resetForm(); setTab("items");
  };

  const run = () => {
    setGenerated(generateFromWardrobe(w.items, w.prefs, 8));
    setActive(0); setTab("build");
  };

  if (!w.ready) return <div className="py-24 text-center text-[var(--secondary)]">بارگذاری...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-widest text-[var(--accent)] uppercase mb-1">Smart Wardrobe</p>
          <h1 className="text-3xl font-bold">کمد من</h1>
          <p className="mt-2 text-[var(--secondary)] text-sm">اول نوع لباس را انتخاب کن، بعد گروهی آپلود کن. بعداً قابل ویرایش است.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={bulkRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onBulkFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => setShowBulk(true)}
            disabled={busy}
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)] disabled:opacity-50"
          >
            {busy && bulkProgress
              ? `آپلود ${bulkProgress.done}/${bulkProgress.total}`
              : "آپلود دسته‌جمعی"}
          </button>
          <button type="button" onClick={() => { resetForm(); setShowAdd(true); }} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm">
            افزودن تکی
          </button>
          <button type="button" onClick={run} disabled={w.items.length < 2} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm disabled:opacity-40">
            ساخت استایل
          </button>
        </div>
      </div>

      {(bulkMsg || bulkProgress || w.saveError) && (
        <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm">
          {bulkProgress && (
            <div>
              <p className="mb-2">در حال فشرده‌سازی و ذخیره… {bulkProgress.done} از {bulkProgress.total}</p>
              <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all"
                  style={{ width: `${Math.round((bulkProgress.done / Math.max(1, bulkProgress.total)) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {bulkMsg && !bulkProgress && <p>{bulkMsg}</p>}
          {w.saveError && <p className="text-red-600 mt-1">{w.saveError}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="rounded-2xl border border-[var(--border)] p-3"><p className="text-xs text-[var(--secondary)]">لباس</p><p className="text-lg font-semibold">{w.items.length}</p></div>
        <div className="rounded-2xl border border-[var(--border)] p-3"><p className="text-xs text-[var(--secondary)]">ذخیره</p><p className="text-lg font-semibold">{w.outfits.length}</p></div>
        <div className="rounded-2xl border border-[var(--border)] p-3"><p className="text-xs text-[var(--secondary)]">دسته</p><p className="text-lg font-semibold">{new Set(w.items.map(i=>i.category)).size}</p></div>
        <div className="rounded-2xl border border-[var(--border)] p-3"><p className="text-xs text-[var(--secondary)]">حجم تقریبی</p><p className="text-lg font-semibold">{estimateStorageMb(w.items)} MB</p></div>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)] mb-6 overflow-x-auto">
        {([["items","لباس‌ها"],["build","ساخت استایل"],["saved","ذخیره‌ها"],["missing","چی کم داری؟"]] as [Tab,string][]).map(([id,l]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`px-4 py-2 text-sm border-b-2 -mb-px ${tab===id?"border-[var(--accent)] text-[var(--accent)]":"border-transparent text-[var(--secondary)]"}`}>{l}</button>
        ))}
      </div>

      {tab==="items" && (
        w.items.length===0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border)] p-14 text-center max-w-lg mx-auto">
            <p className="text-xl font-semibold">کمد خالی است</p>
            <p className="mt-3 text-sm text-[var(--secondary)] leading-relaxed">
              اول نوع لباس را انتخاب کن (مثلاً شلوار)، بعد چند عکس را با هم آپلود کن.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setShowBulk(true)} className="rounded-full bg-[var(--foreground)] px-8 py-3 text-sm text-[var(--background)]">
                آپلود دسته‌جمعی
              </button>
              <button type="button" onClick={() => setShowAdd(true)} className="rounded-full border border-[var(--border)] px-8 py-3 text-sm">
                افزودن تکی
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {w.items.map((item) => (
              <div key={item.id} className={`rounded-2xl border overflow-hidden bg-[var(--card)] ${lastBulkIds.includes(item.id) ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)]"}`}>
                <div className="relative aspect-square bg-[var(--muted)]">
                  <Image src={item.imageData} alt={item.name} fill unoptimized className="object-cover" sizes="200px" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-[var(--secondary)]">{CATEGORY_LABELS[item.category]}</p>
                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={() => openEdit(item)} className="text-xs text-[var(--accent)]">ویرایش</button>
                    <button type="button" onClick={() => { if(confirm("حذف؟")) w.removeItem(item.id); }} className="text-xs text-red-600">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab==="build" && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <select className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm bg-white" value={w.prefs.occasion||""} onChange={(e)=>w.setPrefs({...w.prefs, occasion:(e.target.value||undefined) as WardrobeOccasion|undefined})}>
              <option value="">موقعیت</option>
              <option value="everyday">روزمره</option><option value="school">دانشگاه</option>
              <option value="work">کار</option><option value="party">مهمانی</option>
              <option value="date">قرار</option><option value="formal">رسمی</option><option value="sports">ورزش</option>
            </select>
            <select className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm bg-white" value={w.prefs.style||""} onChange={(e)=>w.setPrefs({...w.prefs, style:(e.target.value||undefined) as WardrobeStyle|undefined})}>
              <option value="">استایل</option>
              <option value="streetwear">استریت‌ویر</option><option value="casual">کژوال</option>
              <option value="minimal">مینیمال</option><option value="sporty">اسپرتی</option>
            </select>
            <select className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm bg-white" value={w.prefs.season||""} onChange={(e)=>w.setPrefs({...w.prefs, season:(e.target.value||undefined) as WardrobeSeason|undefined})}>
              <option value="">فصل</option>
              <option value="spring">بهار</option><option value="summer">تابستان</option>
              <option value="fall">پاییز</option><option value="winter">زمستان</option>
            </select>
            <button type="button" onClick={run} disabled={w.items.length<2} className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)] disabled:opacity-40">تولید ترکیب</button>
          </div>
          <div className="lg:col-span-8">
            {!current ? (
              <div className="border border-dashed border-[var(--border)] rounded-2xl p-10 text-center text-[var(--secondary)] text-sm">ترکیبی تولید نشده</div>
            ) : (
              <div>
                <div className="flex justify-between text-sm text-[var(--secondary)] mb-3">
                  <span>{active+1}/{generated.length} · امتیاز {current.score}</span>
                  <div className="flex gap-2">
                    <button type="button" disabled={active===0} onClick={()=>setActive(a=>a-1)} className="border rounded-full px-3 py-1 disabled:opacity-30">قبلی</button>
                    <button type="button" disabled={active>=generated.length-1} onClick={()=>setActive(a=>a+1)} className="border rounded-full px-3 py-1 disabled:opacity-30">بعدی</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {current.items.map((it, idx) => (
                    <div key={it.id+idx} className="rounded-xl border border-[var(--border)] overflow-hidden">
                      <div className="relative aspect-square"><Image src={it.imageData} alt={it.name} fill unoptimized className="object-cover" sizes="120px" /></div>
                      <div className="p-2">
                        <p className="text-xs truncate">{it.name}</p>
                        <button type="button" onClick={()=>{
                          const next = replaceItemInOutfit(current.items, idx, w.items, w.prefs);
                          if(!next) return;
                          const scored = scoreOutfitItems(next, w.prefs);
                          const copy=[...generated];
                          copy[active]={ items: next, score: scored.score, explanationFa: scored.explanationFa };
                          setGenerated(copy);
                        }} className="text-[10px] text-[var(--accent)]">جایگزینی</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[var(--secondary)] mb-3">{current.explanationFa}</p>
                <button type="button" onClick={()=>{ w.saveOutfit(toSavedOutfit(current, w.prefs.occasion)); setTab("saved"); }} className="rounded-full bg-[var(--foreground)] px-6 py-2.5 text-sm text-[var(--background)]">ذخیره</button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==="saved" && (
        w.outfits.length===0 ? <p className="text-center py-12 text-[var(--secondary)]">خالی</p> : (
          <div className="space-y-3">
            {w.outfits.map(o=>{
              const its=o.itemIds.map(id=>w.items.find(i=>i.id===id)).filter(Boolean) as WardrobeItem[];
              return (
                <div key={o.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex justify-between gap-2">
                    <div><p className="font-medium">{o.name}</p><p className="text-xs text-[var(--secondary)]">امتیاز {o.score}</p></div>
                    <button type="button" onClick={()=>w.removeOutfit(o.id)} className="text-xs text-red-600">حذف</button>
                  </div>
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {its.map(it=>(
                      <div key={it.id} className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden">
                        <Image src={it.imageData} alt={it.name} fill unoptimized className="object-cover" sizes="56px" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {tab==="missing" && (
        <div className="space-y-3">
          {missing.map((m,i)=>(
            <div key={i} className="rounded-2xl border border-[var(--border)] p-4">
              <p className="font-medium">{m.titleFa}</p>
              <p className="text-sm text-[var(--secondary)] mt-1">{m.reasonFa}</p>
            </div>
          ))}
        </div>
      )}

      {showBulk && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--background)] border border-[var(--border)] p-5">
            <div className="flex justify-between mb-2">
              <h2 className="font-bold">آپلود دسته‌جمعی</h2>
              <button type="button" onClick={() => setShowBulk(false)} className="text-sm text-[var(--secondary)]">بستن</button>
            </div>
            <p className="text-sm text-[var(--secondary)] mb-4 leading-relaxed">
              اول مشخص کن این دسته عکس‌ها چه نوعی هستند. بعد از آپلود می‌توانی تک‌تک ویرایش کنی.
              (تا وقتی هوش مصنوعی اضافه شود همین روش دستی است.)
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--secondary)] mb-1.5">نوع لباس *</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_LABELS) as WardrobeCategory[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setBulkCategory(k)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                        bulkCategory === k
                          ? "bg-[var(--foreground)] text-[var(--background)] border-transparent"
                          : "border-[var(--border)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      {CATEGORY_LABELS[k]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-[var(--secondary)] mb-1">رنگ غالب</p>
                  <select value={bulkColor} onChange={(e) => setBulkColor(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-[var(--secondary)] mb-1">استایل</p>
                  <select value={bulkStyle} onChange={(e) => setBulkStyle(e.target.value as WardrobeStyle)} className="w-full rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                    <option value="casual">کژوال</option>
                    <option value="streetwear">استریت‌ویر</option>
                    <option value="minimal">مینیمال</option>
                    <option value="sporty">اسپرتی</option>
                    <option value="smart-casual">اسمارت کژوال</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-[var(--secondary)] mb-1">فرم</p>
                  <select value={bulkFit} onChange={(e) => setBulkFit(e.target.value as WardrobeFit)} className="w-full rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                    <option value="regular">معمولی</option>
                    <option value="oversized">اورسایز</option>
                    <option value="slim">اسلیم</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-[var(--secondary)] mb-1">فصل</p>
                  <select value={bulkSeason} onChange={(e) => setBulkSeason(e.target.value as WardrobeSeason)} className="w-full rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                    <option value="all">همه فصل‌ها</option>
                    <option value="spring">بهار</option>
                    <option value="summer">تابستان</option>
                    <option value="fall">پاییز</option>
                    <option value="winter">زمستان</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-[var(--secondary)]">
                انتخاب فعلی: <strong className="text-[var(--foreground)]">{CATEGORY_LABELS[bulkCategory]}</strong>
              </p>
              <button
                type="button"
                onClick={startBulkPick}
                className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)]"
              >
                انتخاب عکس‌ها و آپلود
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--background)] border border-[var(--border)] p-5">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">{editingId ? "ویرایش لباس" : "افزودن لباس"}</h2>
              <button type="button" onClick={()=>{ setShowAdd(false); resetForm(); }} className="text-sm text-[var(--secondary)]">بستن</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e)=>onFile(e.target.files?.[0]||null)} />
            <button type="button" onClick={()=>fileRef.current?.click()} disabled={busy} className="w-full aspect-[4/3] rounded-2xl border border-dashed border-[var(--border)] relative overflow-hidden bg-[var(--muted)]/40 flex items-center justify-center">
              {preview ? <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" /> : <span className="text-sm">{busy?"...":"آپلود / دوربین"}</span>}
            </button>
            <div className="mt-3 space-y-2">
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="نام" className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm bg-white" />
              <div className="grid grid-cols-2 gap-2">
                <select value={category} onChange={(e)=>setCategory(e.target.value as WardrobeCategory)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                  {Object.entries(CATEGORY_LABELS).map(([k,v])=> <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={mainColor} onChange={(e)=>setMainColor(e.target.value)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                  {COLOR_OPTIONS.map(c=> <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <select value={style} onChange={(e)=>setStyle(e.target.value as WardrobeStyle)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                  <option value="streetwear">استریت‌ویر</option><option value="casual">کژوال</option>
                  <option value="minimal">مینیمال</option><option value="sporty">اسپرتی</option>
                </select>
                <select value={fit} onChange={(e)=>setFit(e.target.value as WardrobeFit)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                  <option value="oversized">اورسایز</option><option value="regular">معمولی</option><option value="slim">اسلیم</option>
                </select>
                <select value={season} onChange={(e)=>setSeason(e.target.value as WardrobeSeason)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                  <option value="all">همه فصل‌ها</option>
                  <option value="spring">بهار</option><option value="summer">تابستان</option>
                  <option value="fall">پاییز</option><option value="winter">زمستان</option>
                </select>
                <select value={pattern} onChange={(e)=>setPattern(e.target.value as WardrobePattern)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white">
                  <option value="solid">ساده</option><option value="striped">راه‌راه</option>
                  <option value="checked">چهارخانه</option><option value="printed">طرح‌دار</option>
                </select>
                <select value={secondaryColor} onChange={(e)=>setSecondaryColor(e.target.value)} className="rounded-xl border border-[var(--border)] px-2 py-2 text-sm bg-white col-span-2">
                  <option value="">رنگ ثانویه (اختیاری)</option>
                  {COLOR_OPTIONS.map(c=> <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <button type="button" onClick={submit} className="mt-4 w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)]">
              {editingId ? "ذخیره تغییرات" : "افزودن به کمد"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
