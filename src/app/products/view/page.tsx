"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";

function ProductFromQuery() {
  const id = useSearchParams().get("id") ?? "";
  return <ProductDetail id={id} />;
}

/** Product page for items added in the admin panel (they have no static page). */
export default function ProductViewPage() {
  return (
    <Suspense fallback={null}>
      <ProductFromQuery />
    </Suspense>
  );
}
