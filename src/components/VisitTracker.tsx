"use client";

import { useEffect } from "react";
import { trackPageVisit } from "@/lib/admin-stats";

export function VisitTracker() {
  useEffect(() => {
    try {
      trackPageVisit();
    } catch {
      /* never break the site over analytics */
    }
  }, []);
  return null;
}
