"use client";

import { useEffect, useState } from "react";
import { getCurrentSeason, Season, SEASON_LABEL_FA } from "@/lib/season";

/**
 * تم فصلی سبک: فقط data-season روی html + چند ذره CSS.
 * بدون کتابخانه اضافه و با احترام به prefers-reduced-motion.
 */
export function SeasonalTheme() {
  const [season, setSeason] = useState<Season>("fall");

  useEffect(() => {
    const s = getCurrentSeason();
    setSeason(s);
    document.documentElement.setAttribute("data-season", s);
    return () => {
      document.documentElement.removeAttribute("data-season");
    };
  }, []);

  return (
    <>
      <div className="season-fx" aria-hidden="true" data-season={season}>
        <span className="season-dot d1" />
        <span className="season-dot d2" />
        <span className="season-dot d3" />
        <span className="season-dot d4" />
        <span className="season-dot d5" />
        <span className="season-dot d6" />
      </div>
      <span className="sr-only">تم فصلی: {SEASON_LABEL_FA[season]}</span>
    </>
  );
}
