import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductById } from "@/data/products";
import { outfits } from "@/data/outfits";
import { OutfitCard } from "@/components/OutfitCard";
import { LiveProductPrice } from "@/components/LiveProductPrice";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id) ?? getProductById(id);
  if (!product) return { title: "محصول پیدا نشد" };
  return {
    title: `${product.nameFa} | SETCHI`,
    description: product.descriptionFa,
  };
}

const categoryLabels: Record<string, string> = {
  "oversized-tshirt": "تی‌شرت اورسایز",
  hoodie: "هودی",
  "cargo-pants": "شلوار کارگو",
  jacket: "کاپشن",
  sneakers: "اسنیکرز",
  accessories: "اکسسوری",
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const relatedOutfits = outfits.filter((o) =>
    o.items.some((item) => item.productId === product.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--muted)]">
            <Image
              src={product.images[0]}
              alt={product.nameFa}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-[var(--accent)] font-medium">
            {categoryLabels[product.category] || product.category}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {product.nameFa}
          </h1>
          <p className="mt-1 text-[var(--secondary)]">{product.name}</p>

          <div className="mt-6">
            <LiveProductPrice
              productId={product.id}
              fallbackPrice={product.price}
            />
          </div>

          <p className="mt-6 text-[var(--secondary)] leading-relaxed">
            {product.descriptionFa}
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">سایزهای موجود</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="w-11 h-11 flex items-center justify-center rounded-lg border border-[var(--border)] text-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">رنگ‌ها</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-[var(--muted)] px-3 py-1 text-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/style-assistant/"
              className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
            >
              پیدا کردن استایل با این محصول
            </Link>
            <Link
              href="/products/"
              className="rounded-full border border-[var(--border)] px-7 py-3 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
            >
              بازگشت به کاتالوگ
            </Link>
          </div>
        </div>
      </div>

      {relatedOutfits.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold mb-8">
            استایل‌هایی که این محصول در آن‌ها هست
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedOutfits.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
