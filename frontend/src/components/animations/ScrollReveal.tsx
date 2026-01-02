"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "@/lib/gsap-config";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "scale";
    stagger?: number;
}

export default function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
    stagger = 0,
}: ScrollRevealProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;
        const childElements = stagger > 0 ? element.children : [element];

        let initialState: gsap.TweenVars = { opacity: 0 };

        switch (direction) {
            case "up":
                initialState.y = 60;
                break;
            case "down":
                initialState.y = -60;
                break;
            case "left":
                initialState.x = -60;
                break;
            case "right":
                initialState.x = 60;
                break;
            case "scale":
                initialState.scale = 0.8;
                break;
        }

        gsap.set(childElements, initialState);

        gsap.to(childElements, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.8,
            delay: delay,
            stagger: stagger,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
        });

    }, [delay, direction, stagger]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
}
