"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FloatingElement {
    id: number;
    icon: string;
    size: number;
    color: string;
    speed: number;
}

const elements: FloatingElement[] = [
    { id: 1, icon: "€", size: 40, color: "text-blue-500", speed: 0.3 },
    { id: 2, icon: "€", size: 30, color: "text-indigo-500", speed: 0.5 },
    { id: 3, icon: "€", size: 35, color: "text-purple-500", speed: 0.4 },
    { id: 4, icon: "💳", size: 45, color: "text-blue-600", speed: 0.35 },
    { id: 5, icon: "💳", size: 38, color: "text-indigo-600", speed: 0.45 },
    { id: 6, icon: "📊", size: 42, color: "text-emerald-500", speed: 0.38 },
    { id: 7, icon: "🔒", size: 36, color: "text-amber-500", speed: 0.42 },
    { id: 8, icon: "⭐", size: 32, color: "text-yellow-500", speed: 0.48 },
];

export default function FloatingElements() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const floatingElements = containerRef.current.querySelectorAll(".floating-element");

        floatingElements.forEach((element, index) => {
            const el = element as HTMLElement;
            const speed = elements[index].speed;

            // Initial random position
            gsap.set(el, {
                x: gsap.utils.random(-50, 50),
                y: gsap.utils.random(-50, 50),
                rotation: gsap.utils.random(-15, 15),
            });

            // Floating animation
            gsap.to(el, {
                y: `+=${gsap.utils.random(-100, 100)}`,
                x: `+=${gsap.utils.random(-80, 80)}`,
                rotation: `+=${gsap.utils.random(-30, 30)}`,
                duration: gsap.utils.random(4, 7),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.3,
            });

            // Parallax on scroll
            gsap.to(el, {
                y: () => window.innerHeight * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // Hover effect
            el.addEventListener("mouseenter", () => {
                gsap.to(el, {
                    scale: 1.3,
                    rotation: "+=15",
                    duration: 0.3,
                    ease: "back.out(2)",
                });
            });

            el.addEventListener("mouseleave", () => {
                gsap.to(el, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        });

    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
        >
            {elements.map((elem, index) => (
                <div
                    key={elem.id}
                    className="floating-element absolute pointer-events-auto cursor-pointer"
                    style={{
                        left: `${10 + (index * 12)}%`,
                        top: `${20 + (index % 3) * 25}%`,
                        fontSize: `${elem.size}px`,
                    }}
                >
                    <span className={`${elem.color} drop-shadow-lg`}>{elem.icon}</span>
                </div>
            ))}
        </div>
    );
}
