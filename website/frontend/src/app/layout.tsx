import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brand Deals | Original Branded Shoes",
    template: "%s | Brand Deals",
  },
  description:
    "Shop original branded shoes from Nike, Adidas, Puma, Skechers, Reebok and more. Best prices, genuine products, free shipping across India.",
  keywords: [
    "shoes",
    "branded shoes",
    "Nike",
    "Adidas",
    "Puma",
    "Skechers",
    "Reebok",
    "online shoe store",
    "India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Brand Deals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main style={{ minHeight: "calc(100vh - 350px)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

