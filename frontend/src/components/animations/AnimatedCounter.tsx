"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    decimals?: number;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    end,
    suffix = "",
    decimals = 0,
    duration = 2,
    className = "",
}: AnimatedCounterProps) {
    const counterRef = useRef<HTMLSpanElement>(null);
    const valueRef = useRef({ value: 0 });

    useEffect(() => {
        if (!counterRef.current) return;

        const counter = { value: 0 };

        gsap.to(counter, {
            value: end,
            duration: duration,
            ease: "power2.out",
            scrollTrigger: {
                trigger: counterRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
            },
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.textContent =
                        counter.value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + suffix;
                }
            },
        });

    }, [end, suffix, decimals, duration]);

    return <span ref={counterRef} className={className}>0{suffix}</span>;
}
