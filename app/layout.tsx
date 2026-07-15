import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRESS - Premium Fashion E-Commerce",
  description:
    "Discover premium fashion at DRESS. Shop the latest trends in men's and women's clothing, including oversized tees, hoodies, joggers, and more. Free shipping on orders above ₹999.",
  keywords: "fashion, clothing, premium fashion, men's wear, women's wear, oversized tees, hoodies, online shopping",
  openGraph: {
    title: "DRESS - Premium Fashion E-Commerce",
    description: "Discover premium fashion at DRESS. Shop the latest trends.",
    type: "website",
    locale: "en_IN",
    siteName: "DRESS",
  },
  twitter: {
    card: "summary_large_image",
    title: "DRESS - Premium Fashion E-Commerce",
    description: "Discover premium fashion at DRESS. Shop the latest trends.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
