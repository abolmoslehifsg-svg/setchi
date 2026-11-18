import type { Metadata } from "next";
import "./globals.css";
import "@/styles/font-vazirmatn.css";
import "@/styles/font-fraunces.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeasonalTheme } from "@/components/SeasonalTheme";
import { VisitTracker } from "@/components/VisitTracker";
import { SiteThemeApplier } from "@/components/SiteThemeApplier";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { WardrobeProvider } from "@/context/WardrobeContext";

export const metadata: Metadata = {
  title: "SETCHI | ستچی — استایلت رو پیدا کن",
  description:
    "پلتفرم استایل‌دهی مردانه و کمد هوشمند. با لباس‌هایی که داری، استایل بهتر بساز.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <CartProvider>
          <FavoritesProvider>
            <WardrobeProvider>
              <SeasonalTheme />
              <SiteThemeApplier />
              <VisitTracker />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </WardrobeProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
