import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SETCHI | ستچی — استایلت رو پیدا کن",
  description:
    "پلتفرم استایل‌دهی مردانه با هوش مصنوعی. کشف استایل شخصی، ترکیب لباس و پیشنهادات تخصصی برای مردان ۱۸ تا ۳۵ سال.",
  keywords: [
    "استایل مردانه",
    "مد",
    "استریت‌ویر",
    "ستچی",
    "SETCHI",
    "پیشنهاد لباس",
    "استایل شخصی",
  ],
  openGraph: {
    title: "SETCHI | ستچی",
    description: "استایلت رو پیدا کن.",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
