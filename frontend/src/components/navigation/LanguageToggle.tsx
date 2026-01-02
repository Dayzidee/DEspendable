"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

interface LanguageToggleProps {
    className?: string;
}

export default function LanguageToggle({ className = "" }: LanguageToggleProps) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={() => switchLocale("en")}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${locale === "en"
                    ? "bg-[#0018A8] text-white"
                    : "text-[#666666] hover:bg-gray-100"
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => switchLocale("de")}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${locale === "de"
                    ? "bg-[#0018A8] text-white"
                    : "text-[#666666] hover:bg-gray-100"
                    }`}
            >
                DE
            </button>
        </div>
    );
}
