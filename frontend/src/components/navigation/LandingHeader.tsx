"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import LanguageToggle from "./LanguageToggle";

export default function LandingHeader() {
    const t = useTranslations('auth');

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        {/* Logo Icon */}
                        <div className="relative">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        {/* Brand Name */}
                        <span className="text-2xl font-bold text-[#0018A8]">
                            DE<span className="font-normal">spendables</span>
                        </span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-6">
                    <MegaMenu />
                    <LanguageToggle />
                    <Link
                        href="/login"
                        className="px-6 py-2 text-[#0018A8] font-semibold hover:bg-white/50 rounded-lg transition"
                    >
                        {t('login')}
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-2 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        {t('signup')}
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden flex items-center gap-2">
                    <LanguageToggle />
                    <MobileMenu />
                </div>
            </div>
        </nav>
    );
}
