import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEspendables | Modern Banking",
  description: "Secure, Fast, and Premium Banking Experience",
};

// This root layout just passes through to the locale layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
