"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { FaHome, FaExchangeAlt, FaCreditCard, FaGift, FaInbox, FaUserShield, FaSignOutAlt, FaLeaf, FaChartLine, FaPiggyBank } from "react-icons/fa";
import { motion } from "framer-motion";

import { useTranslations } from "next-intl";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuth();
    const t = useTranslations();

    const menuItems = [
        { name: t("nav.dashboard"), href: "/dashboard", icon: <FaHome /> },
        { name: t("nav.transactions"), href: "/transactions", icon: <FaExchangeAlt /> },
        { name: t("nav.accounts"), href: "/accounts", icon: <FaPiggyBank /> },
        { name: t("nav.transfer"), href: "/transfer", icon: <FaExchangeAlt /> },
        { name: t("nav.cards"), href: "/cards", icon: <FaCreditCard /> },
        { name: t("nav.investments"), href: "/investments", icon: <FaChartLine /> },
        { name: t("nav.rewards"), href: "/rewards", icon: <FaGift /> },
        { name: t("nav.postbox"), href: "/postbox", icon: <FaInbox /> },
    ];

    // Add Admin link if user is admin (mock logic, ideally check claim)
    if (user?.email?.includes("admin") || true) { // Keeping consistent with previous mock
        menuItems.push({ name: t("nav.admin"), href: "/admin", icon: <FaUserShield /> });
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex">
            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white shadow-lg">
                        <FaLeaf className="text-xl" />
                    </div>
                    <span className="text-xl font-bold text-[#0018A8]">
                        DE<span className="font-normal text-gray-700">spendables</span>
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname.includes(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-[var(--color-primary)] text-white shadow-md"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                                    }`}
                            >
                                <span className={`text-lg ${isActive ? "text-white" : "text-gray-400 group-hover:text-[var(--color-primary)]"}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => auth.signOut()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span className="font-medium">{t("common.logout")}</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation is handled by BottomNav component globally,
                but we might want to hide it or adjust layouts.
                For now, we focus on the main content area padding. */}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
