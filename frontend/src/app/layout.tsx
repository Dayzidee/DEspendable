import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEspendables | Modern Banking",
  description: "Secure, Fast, and Premium Banking Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
