"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OutfitDetail } from "@/components/OutfitDetail";

function OutfitFromQuery() {
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

  return <OutfitDetail id={id} />;
}

export default function OutfitViewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center text-[var(--secondary)]">
          در حال بارگذاری...
        </div>
      }
    >
      <OutfitFromQuery />
    </Suspense>
  );
}
