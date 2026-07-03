import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import MicrosoftClarity from "./clarity";
import IntroScreen from "./components/IntroScreen";
import "./globals.css";

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
  description: "Personal website, portfolio and technical blog of Andrea Bianco.",
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
        <IntroScreen />
        {children}
        <GoogleAnalytics gaId="G-986WZSRXDC" />
        <MicrosoftClarity />
      </body>
    </html>
  );
}