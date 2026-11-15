"use client";

import { useEffect } from "react";
import {
  applySiteTheme,
  loadSiteContent,
  SITE_CONTENT_UPDATED_EVENT,
} from "@/lib/site-content";

export function SiteThemeApplier() {
  useEffect(() => {
    const sync = () => applySiteTheme(loadSiteContent());
    sync();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
    return () => window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, sync);
  }, []);
  return null;
}
