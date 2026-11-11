import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductDetail } from "@/components/ProductDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "محصول پیدا نشد" };
  return {
    title: `${product.nameFa} | SETCHI`,
    description: product.descriptionFa,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  if (!products.some((p) => p.id === id)) notFound();
  return <ProductDetail id={id} />;
}
