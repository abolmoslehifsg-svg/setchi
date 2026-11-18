"use client";

import { useEffect } from "react";
import { B64 as r400, WEIGHT as w400 } from "@/lib/font-data/vazirmatn-fd-regular";
import { B64 as r500, WEIGHT as w500 } from "@/lib/font-data/vazirmatn-fd-medium";
import { B64 as r600, WEIGHT as w600 } from "@/lib/font-data/vazirmatn-fd-semibold";
import { B64 as r700, WEIGHT as w700 } from "@/lib/font-data/vazirmatn-fd-bold";

const STYLE_ID = "setchi-vazirmatn-offline";

function face(weight: number, b64: string) {
  return `@font-face{font-family:'Vazirmatn';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
}

/** Injects self-hosted Vazirmatn FD (v33) — no network required. */
export function VazirmatnOffline() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = [
      face(w400, r400),
      face(w500, r500),
      face(w600, r600),
      face(w700, r700),
    ].join("\n");
    document.head.appendChild(el);
  }, []);
  return null;
}
