"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";

import LanguageToggle from "./LanguageToggle";
import { gsap } from "@/lib/gsap-config";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface MenuItem {
    title: string;
    href: string;
    children?: MenuItem[];
}

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);


    const menuItems: MenuItem[] = [
        {
            title: "About Us",
            href: "#",
            children: [
                { title: "Mission", href: "/mission" },
                { title: "Vision", href: "/vision" },
                { title: "Team", href: "/team" },
                { title: "Achievements", href: "/achievements" },
                { title: "Locations", href: "/directions" },
            ],
        },
        {
            title: "Features",
            href: "#",
            children: [
                { title: "All Features", href: "/features" },
                { title: "Security", href: "/features#security" },
                { title: "Virtual Cards", href: "/features#cards" },
            ],
        },
        {
            title: "Support",
            href: "#",
            children: [
                { title: "Customer Service", href: "/customer-service" },
                { title: "FAQ", href: "/faq" },
                { title: "Contact", href: "/directions#contact" },
            ],
        },
    ];

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when menu is open
            document.body.style.overflow = "hidden";

            // Animate menu in
            if (menuRef.current && overlayRef.current) {
                gsap.fromTo(
                    overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3 }
                );

                gsap.fromTo(
                    menuRef.current,
                    { x: "100%" },
                    { x: "0%", duration: 0.4, ease: "power3.out" }
                );

                // Stagger menu items
                const items = menuRef.current.querySelectorAll(".mobile-menu-item");
                gsap.fromTo(
                    items,
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.2 }
                );
            }
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const toggleSection = (title: string) => {
        setExpandedSections((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const closeMenu = () => {
        if (menuRef.current && overlayRef.current) {
            gsap.to(menuRef.current, {
                x: "100%",
                duration: 0.3,
                ease: "power2.in",
            });
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => setIsOpen(false),
            });
        }
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 text-[#0018A8] hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Full-Screen Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        ref={overlayRef}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={closeMenu}
                    />

                    {/* Menu Panel */}
                    <div
                        ref={menuRef}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold gradient-text">DEspendables</h2>
                            <button
                                onClick={closeMenu}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6 text-[#666666]" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="p-6 space-y-2">
                            {menuItems.map((item, index) => (
                                <div key={index} className="mobile-menu-item">
                                    {item.children ? (
                                        // Accordion Section
                                        <div>
                                            <button
                                                onClick={() => toggleSection(item.title)}
                                                className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#1C1C1C] hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                {item.title}
                                                {expandedSections.includes(item.title) ? (
                                                    <ChevronUp className="w-5 h-5 text-[#666666]" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-[#666666]" />
                                                )}
                                            </button>
                                            {expandedSections.includes(item.title) && (
                                                <div className="ml-4 mt-2 space-y-1">
                                                    {item.children.map((child, childIndex) => (
                                                        <Link
                                                            key={childIndex}
                                                            href={child.href}
                                                            onClick={closeMenu}
                                                            className="block p-3 text-[#666666] hover:text-[#0018A8] hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Direct Link
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className="block p-4 font-semibold text-[#1C1C1C] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 space-y-4">
                            {/* Language Toggle */}
                            <div className="mobile-menu-item">
                                <p className="text-sm text-[#666666] mb-2">Language</p>
                                <LanguageToggle />
                            </div>

                            {/* Auth Buttons */}
                            <div className="mobile-menu-item space-y-2">
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="block w-full px-6 py-3 text-center text-[#0018A8] font-semibold border-2 border-[#0018A8] rounded-lg hover:bg-blue-50 transition-all"
                                >
                                    Anmelden
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={closeMenu}
                                    className="block w-full px-6 py-3 text-center bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Konto eröffnen
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
