"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-config";

interface AnimatedBackgroundProps {
    className?: string;
}

export default function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !isMounted) return;

        const blobs = containerRef.current.querySelectorAll(".blob");

        // Animate each blob with different parameters
        blobs.forEach((blob, index) => {
            const tl = gsap.timeline({ repeat: -1, yoyo: true });

            tl.to(blob, {
                x: gsap.utils.random(-100, 100),
                y: gsap.utils.random(-100, 100),
                scale: gsap.utils.random(0.8, 1.2),
                rotation: gsap.utils.random(-45, 45),
                duration: gsap.utils.random(8, 12),
                ease: "sine.inOut",
                delay: index * 0.5,
            });
        });

        // Floating particles animation
        const particles = containerRef.current.querySelectorAll(".particle");
        particles.forEach((particle, index) => {
            gsap.to(particle, {
                y: gsap.utils.random(-200, 200),
                x: gsap.utils.random(-100, 100),
                opacity: gsap.utils.random(0.3, 0.8),
                duration: gsap.utils.random(3, 6),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2,
            });
        });

    }, [isMounted]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        >
            {/* Morphing Blobs */}
            <div className="blob absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
            <div className="blob absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl" />
            <div className="blob absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />

            {/* Floating Particles - Only render on client to avoid hydration mismatch */}
            {isMounted && Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="particle absolute w-2 h-2 bg-blue-500/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}
