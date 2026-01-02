"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { gsap } from "@/lib/gsap-config";

interface MenuItem {
    title: string;
    href: string;
    description: string;
}

interface MenuCategory {
    title: string;
    items: MenuItem[];
}

export default function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('menu');

    const menuCategories: Record<string, MenuCategory> = {
        about: {
            title: t('aboutUs'),
            items: [
                {
                    title: t('mission'),
                    href: "/mission",
                    description: t('missionDesc'),
                },
                {
                    title: t('vision'),
                    href: "/vision",
                    description: t('visionDesc'),
                },
                {
                    title: t('team'),
                    href: "/team",
                    description: t('teamDesc'),
                },
                {
                    title: t('achievements'),
                    href: "/achievements",
                    description: t('achievementsDesc'),
                },
                {
                    title: t('locations'),
                    href: "/directions",
                    description: t('locationsDesc'),
                },
            ],
        },
        features: {
            title: t('features'),
            items: [
                {
                    title: t('allFeatures'),
                    href: "/features",
                    description: t('allFeaturesDesc'),
                },
                {
                    title: t('security'),
                    href: "/features#security",
                    description: t('securityDesc'),
                },
                {
                    title: t('virtualCards'),
                    href: "/cards",
                    description: t('virtualCardsDesc'),
                },
            ],
        },
        support: {
            title: t('support'),
            items: [
                {
                    title: t('customerService'),
                    href: "/customer-service",
                    description: t('customerServiceDesc'),
                },
                {
                    title: t('faq'),
                    href: "/faq",
                    description: t('faqDesc'),
                },
                {
                    title: t('contact'),
                    href: "/#contact",
                    description: t('contactDesc'),
                },
            ],
        },
    };

    useEffect(() => {
        if (activeMenu && menuRef.current) {
            const menuItems = menuRef.current.querySelectorAll(".menu-item");

            gsap.fromTo(
                menuItems,
                {
                    opacity: 0,
                    y: -10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out",
                }
            );
        }
    }, [activeMenu]);

    const handleMouseEnter = (menuKey: string) => {
        setActiveMenu(menuKey);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* Menu Triggers */}
            <div className="flex items-center gap-6">
                {Object.entries(menuCategories).map(([key, category]) => (
                    <button
                        key={key}
                        onMouseEnter={() => handleMouseEnter(key)}
                        className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${activeMenu === key
                            ? "text-[#0018A8] bg-blue-50"
                            : "text-[#666666] hover:text-[#0018A8] hover:bg-gray-50"
                            }`}
                    >
                        {category.title}
                        <span className="ml-1">▼</span>
                    </button>
                ))}
            </div>

            {/* Mega Menu Dropdown */}
            {activeMenu && (
                <div
                    className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 w-[350px] max-h-[500px] overflow-y-auto"
                    onMouseEnter={() => setActiveMenu(activeMenu)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="space-y-2">
                        {menuCategories[activeMenu].items.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="menu-item block p-4 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                                onClick={() => setActiveMenu(null)}
                            >
                                <h3 className="font-bold text-base text-[#1C1C1C] mb-1 group-hover:text-[#0018A8] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#666666] leading-relaxed">
                                    {item.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
