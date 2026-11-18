"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";

function ProductFromQuery() {
  const sp = useSearchParams();
  const [id, setId] = useState(() => sp.get("id") ?? "");

  useEffect(() => {
    const fromSp = sp.get("id");
    if (fromSp) {
      setId(fromSp);
      return;
    }
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("id");
      if (fromUrl) setId(fromUrl);
    } catch {
      /* ignore */
    }
  }, [sp]);

  // includeDrafts: admin may open a draft product from the catalog after publishing toggle lag
  return <ProductDetail id={id} includeDrafts />;
}

/** Client-only product page — works for seed + admin-added items (static export). */
export default function ProductViewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center text-[var(--secondary)]">
          در حال بارگذاری...
        </div>
      }
    >
      <ProductFromQuery />
    </Suspense>
  );
}
