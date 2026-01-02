"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export default function BottomNav() {
    const pathname = usePathname();
    const t = useTranslations('navigation');

    const navItems = [
        {
            label: t("dashboard"),
            href: "/dashboard",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            )
        },
        {
            label: t("transfer"),
            href: "/transfer",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            )
        },
        {
            label: t("postbox"),
            href: "/postbox",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            )
        },
        {
            label: t("menu"),
            href: "/menu",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )
        }
    ];

    // Landing pages where BottomNav should NOT show
    const landingPages = [
        '/',
        '/login',
        '/signup',
        '/terms',
        '/datenschutz',
        '/cookies',
        '/impressum',
        '/faq'
    ];

    // Don't show on landing pages
    if (landingPages.includes(pathname)) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 pb-safe z-50">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center p-2 text-xs font-medium transition ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                            <div className="mb-1">{item.icon}</div>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
