import type { Metadata } from "next";
import "./globals.css";
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
      <head>
        {/* CDN fonts — avoids next/font Google fetch failures in CI */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Vazirmatn:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
