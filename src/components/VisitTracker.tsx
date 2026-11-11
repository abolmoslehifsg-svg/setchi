"use client";

import { useEffect } from "react";
import { trackPageVisit } from "@/lib/admin-stats";

export function VisitTracker() {
  useEffect(() => {
    trackPageVisit();
  }, []);
  return null;
}
