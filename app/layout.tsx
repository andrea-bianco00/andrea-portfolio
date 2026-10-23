import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import MicrosoftClarity from "./clarity";
import foxIcon from "./fox-512.png";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrea Bianco | Data Scientist",
  description: "Portfolio di Andrea Bianco: progetti di Data Science, Machine Learning, NLP e ricerca statistica.",
  icons: {
    icon: [{ url: foxIcon.src, type: "image/png", sizes: "512x512" }],
    shortcut: foxIcon.src,
    apple: [{ url: foxIcon.src, sizes: "512x512", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalytics gaId="G-986WZSRXDC" />
        <MicrosoftClarity />
      </body>
    </html>
  );
}