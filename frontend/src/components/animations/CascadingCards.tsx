"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { useTranslations } from "next-intl";

interface Card {
    id: number;
    gradient: string;
    title: string;
    number: string;
}

const cards: Card[] = [
    {
        id: 1,
        gradient: "from-[#0018A8] to-[#0025D9]",
        title: "Premium Card",
        number: "•••• 4829",
    },
    {
        id: 2,
        gradient: "from-purple-600 to-pink-600",
        title: "Platinum Card",
        number: "•••• 7234",
    },
    {
        id: 3,
        gradient: "from-amber-500 to-orange-600",
        title: "Gold Card",
        number: "•••• 9182",
    },
    {
        id: 4,
        gradient: "from-emerald-500 to-teal-600",
        title: "Business Card",
        number: "•••• 5647",
    },
];

export default function CascadingCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    useEffect(() => {
        if (!containerRef.current) return;

        const cardElements = containerRef.current.querySelectorAll(".card-item");

        // Initial setup - position cards off-screen
        gsap.set(cardElements, {
            x: -200,
            opacity: 0,
            rotationY: -45,
        });

        // Create cascading animation timeline
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

        cardElements.forEach((card, index) => {
            tl.to(
                card,
                {
                    x: 0,
                    opacity: 1,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "back.out(1.4)",
                },
                index * 0.2 // Stagger delay
            );
        });

        // Hold all cards visible
        tl.to({}, { duration: 3 });

        // Cascade out
        cardElements.forEach((card, index) => {
            tl.to(
                card,
                {
                    x: 200,
                    opacity: 0,
                    rotationY: 45,
                    duration: 0.6,
                    ease: "power2.in",
                },
                `-=${0.8 - index * 0.15}` // Reverse stagger
            );
        });

        // Add hover effects
        cardElements.forEach((card) => {
            const cardElement = card as HTMLElement;

            cardElement.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    scale: 1.05,
                    z: 50,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });

            cardElement.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    scale: 1,
                    z: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[400px] flex items-center justify-center perspective-1000"
        >
            <div className="relative w-80 h-52">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`card-item absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl p-6 shadow-2xl cursor-pointer`}
                        style={{
                            transformStyle: "preserve-3d",
                            zIndex: cards.length - index,
                        }}
                    >
                        <div className="text-white h-full flex flex-col justify-between">
                            <div className="text-sm opacity-90">{card.title}</div>
                            <div>
                                <div className="text-xl font-mono mb-4">{card.number}</div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs opacity-80">{t("landing.card_valid_until")}</div>
                                        <div className="font-semibold">12/28</div>
                                    </div>
                                    <div className="w-12 h-8 bg-white/20 rounded backdrop-blur-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

