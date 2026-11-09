import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { WardrobeProvider } from "@/context/WardrobeContext";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SETCHI | ستچی — استایلت رو پیدا کن",
  description:
    "پلتفرم استایل‌دهی مردانه و کمد هوشمند. با لباس‌هایی که داری، استایل بهتر بساز.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <CartProvider>
          <FavoritesProvider>
            <WardrobeProvider>
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
