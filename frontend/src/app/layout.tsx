import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { DiscreetProvider } from "@/context/DiscreetContext";

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
      <body>
        <LanguageProvider>
          <DiscreetProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </DiscreetProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
