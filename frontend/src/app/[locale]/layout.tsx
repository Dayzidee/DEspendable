import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/context/AuthContext";
import { DiscreetProvider } from "@/context/DiscreetContext";
import ConsentBanner from "@/components/ConsentBanner";
import BottomNav from "@/components/BottomNav";
import ChatWidget from "@/components/ChatWidget";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Await params in Next.js 16+
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <DiscreetProvider>
                        <AuthProvider>
                            <div className="pb-20"> {/* Padding for BottomNav */}
                                {children}
                            </div>
                            <ChatWidget />
                            <ConsentBanner />
                            <BottomNav />
                        </AuthProvider>
                    </DiscreetProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
