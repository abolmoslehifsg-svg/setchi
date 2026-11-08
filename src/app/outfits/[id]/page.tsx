import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOutfitById, outfits } from "@/data/outfits";
import { getProductById, formatPrice } from "@/data/products";
import { OutfitCard } from "@/components/OutfitCard";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return outfits.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const outfit = getOutfitById(id);
  if (!outfit) return { title: "استایل پیدا نشد" };
  return {
    title: `${outfit.titleFa} | SETCHI`,
    description: outfit.descriptionFa,
  };
}

export default async function OutfitDetailPage({ params }: Props) {
  const { id } = await params;
  const outfit = getOutfitById(id);
  if (!outfit) notFound();

  const products = outfit.items
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...product, role: item.role } : null;
    })
    .filter(Boolean);

  const related = outfits
    .filter(
      (o) =>
        o.id !== outfit.id &&
        o.style.some((s) => outfit.style.includes(s))
    )
    .slice(0, 4);

  const roleLabels: Record<string, string> = {
    top: "بالا",
    bottom: "پایین",
    footwear: "کفش",
    outer: "رویه",
    accessory: "اکسسوری",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--muted)]">
          <Image
            src={outfit.image}
            alt={outfit.titleFa}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {outfit.style.map((s) => (
              <span
                key={s}
                className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium"
              >
                {styleLabel(s)}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {outfit.titleFa}
          </h1>
          <p className="mt-2 text-lg text-[var(--secondary)]">
            {outfit.title}
          </p>
          <p className="mt-6 text-[var(--secondary)] leading-relaxed">
            {outfit.descriptionFa}
          </p>

          <div className="mt-8 p-5 rounded-xl bg-[var(--muted)]">
            <h3 className="font-semibold mb-2">چرا این ترکیب کار می‌کند؟</h3>
            <p className="text-sm text-[var(--secondary)] leading-relaxed">
              {outfit.whyItWorksFa}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
            <div>
              <p className="text-sm text-[var(--secondary)]">قیمت تقریبی</p>
              <p className="text-2xl font-bold mt-1">
                {formatPrice(outfit.estimatedPrice)}
              </p>
            </div>
            <Link
              href="/style-assistant"
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
            >
              ساخت استایل مشابه
            </Link>
          </div>
        </div>
      </div>

      {/* Items */}
      <section className="mt-16 lg:mt-24">
        <h2 className="text-2xl font-bold mb-8">اجزا این استایل</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition-shadow"
            >
              <div className="relative w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]">
                <Image
                  src={p.images[0]}
                  alt={p.nameFa}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[var(--accent)] font-medium">
                  {roleLabels[p.role] || p.role}
                </span>
                <h3 className="font-semibold mt-1 group-hover:text-[var(--accent)] transition-colors truncate">
                  {p.nameFa}
                </h3>
                <p className="text-sm text-[var(--secondary)] mt-1">
                  {formatPrice(p.price)}
                </p>
                <div className="flex gap-1 mt-2">
                  {p.colors.slice(0, 4).map((c: string) => (
                    <span
                      key={c}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold mb-8">استایل‌های مشابه</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function styleLabel(style: string): string {
  const map: Record<string, string> = {
    streetwear: "استریت‌ویر",
    casual: "کژوال",
    sporty: "اسپرتی",
    minimalist: "مینیمال",
    modern: "مدرن",
  };
  return map[style] || style;
}
