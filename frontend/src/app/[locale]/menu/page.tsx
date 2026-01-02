"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { auth } from "@/lib/firebase";
import LanguageSwitch from "@/components/LanguageSwitch";
import Link from "next/link";

export default function Menu() {
    const { user } = useAuth();
    const { t } = useLanguage();

    const menuItems = [
        {
            category: "Profil & Einstellungen",
            items: [
                { label: "Persönliche Daten", href: "#", icon: "user" },
                { label: "Sicherheit (FaceID/PIN)", href: "#", icon: "lock" },
                { label: "App-Einstellungen", href: "#", icon: "cog" },
            ]
        },
        {
            category: "Kartenverwaltung",
            items: [
                { label: "Karte sperren", href: "#", icon: "ban", textClass: "text-[#E2001A]" },
                { label: "Geo-Kontrolle", href: "#", icon: "globe" },
                { label: "Limiteinstellungen", href: "#", icon: "credit-card" }
            ]
        },
        {
            category: "Support & Rechtliches",
            items: [
                { label: t("login.impressum"), href: "/impressum", icon: "info" },
                { label: t("login.privacy"), href: "/datenschutz", icon: "shield" },
                { label: "Hilfe-Center", href: "#", icon: "question" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-[#1C1C1C]">Menü</h1>
            </header>

            <div className="p-6 space-y-6">

                {/* User Card */}
                <div className="bg-[#0018A8] text-white p-6 rounded-2xl flex items-center gap-4 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                        {user?.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{user?.displayName || "Nutzer"}</h2>
                        <p className="text-sm opacity-80">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                            Standard Tier
                        </div>
                    </div>
                </div>

                {/* Menu Sections */}
                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-3 px-1">
                            {section.category}
                        </h3>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition">
                                            <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <span className={`text-sm font-medium ${item.textClass || 'text-[#1C1C1C]'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Language Setting */}
                <div>
                    <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-3 px-1">
                        Einstellungen
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1C1C1C]">Sprache</span>
                        <LanguageSwitch />
                    </div>
                </div>

                <button
                    onClick={() => auth.signOut()}
                    className="w-full bg-white border-2 border-[#E2001A] text-[#E2001A] font-bold py-3 rounded-xl hover:bg-red-50 transition shadow-sm"
                >
                    {t("common.logout")}
                </button>

                <p className="text-center text-xs text-[#666666] pt-4">
                    Version 2.0.1 (Build 2026.01.01) <br />
                    © 2026 DEspendables Bank AG
                </p>
            </div>
        </div>
    );
}
