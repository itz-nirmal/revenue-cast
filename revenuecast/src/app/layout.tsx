import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RevenueCast - AI-Powered Revenue Prediction",
  description:
    "Harness the power of AI to forecast your company's revenue with precision. Make data-driven decisions and unlock your business potential.",
  keywords:
    "revenue prediction, AI, machine learning, business forecasting, financial planning",
  authors: [{ name: "RevenueCast Team" }],
  openGraph: {
    title: "RevenueCast - AI-Powered Revenue Prediction",
    description:
      "Harness the power of AI to forecast your company's revenue with precision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
