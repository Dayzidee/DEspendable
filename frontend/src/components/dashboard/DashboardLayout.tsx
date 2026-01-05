"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { FaHome, FaExchangeAlt, FaCreditCard, FaGift, FaInbox, FaUserShield, FaSignOutAlt, FaLeaf, FaChartLine, FaPiggyBank, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslations } from "next-intl";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isAdmin } = useAuth();
    const t = useTranslations();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: t("nav.dashboard"), href: "/dashboard", icon: <FaHome /> },
        { name: t("nav.transactions"), href: "/transactions", icon: <FaExchangeAlt /> },
        { name: t("nav.accounts"), href: "/accounts", icon: <FaPiggyBank /> },
        { name: t("nav.transfer"), href: "/transfer", icon: <FaExchangeAlt /> },
        { name: t("nav.cards"), href: "/cards", icon: <FaCreditCard /> },
        { name: t("nav.investments"), href: "/investments", icon: <FaChartLine /> },
        { name: t("nav.rewards"), href: "/rewards", icon: <FaGift /> },
        { name: t("nav.rewards"), href: "/rewards", icon: <FaGift /> },
        { name: t("nav.postbox"), href: "/postbox", icon: <FaInbox /> },
        { name: t("nav.profile"), href: "/profile", icon: <FaUser /> },
    ];

    // Add Admin link only if user has is_admin flag
    if (isAdmin) {
        menuItems.push({ name: t("nav.admin"), href: "/admin", icon: <FaUserShield /> });
    }

    const SidebarContent = () => (
        <>
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
                            onClick={() => setIsMobileMenuOpen(false)}
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
        </>
    );

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                >
                    <FaBars className="text-xl text-gray-700" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white">
                        <FaLeaf className="text-sm" />
                    </div>
                    <span className="text-lg font-bold text-[#0018A8]">
                        DE<span className="font-normal text-gray-700">spendables</span>
                    </span>
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
            </header>

            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed h-full z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white">
                                        <FaLeaf className="text-sm" />
                                    </div>
                                    <span className="text-lg font-bold text-[#0018A8]">
                                        DE<span className="font-normal text-gray-700">spendables</span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FaTimes className="text-xl text-gray-700" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <nav className="p-4 space-y-1">
                                    {menuItems.map((item) => {
                                        const isActive = pathname.includes(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                    ? "bg-[var(--color-primary)] text-white shadow-md"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                                                    }`}
                                            >
                                                <span className={`text-lg ${isActive ? "text-white" : "text-gray-400 group-hover:text-[var(--color-primary)]"}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <button
                                    onClick={() => auth.signOut()}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt />
                                    <span className="font-medium">{t("common.logout")}</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
