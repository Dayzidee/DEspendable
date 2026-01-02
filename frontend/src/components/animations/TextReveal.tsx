"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "@/lib/gsap-config";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    stagger?: number;
    type?: "chars" | "words" | "lines";
}

export default function TextReveal({
    children,
    className = "",
    delay = 0,
    stagger = 0.03,
    type = "chars",
}: TextRevealProps) {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        const text = textRef.current.textContent || "";
        textRef.current.innerHTML = "";

        let elements: HTMLSpanElement[] = [];

        if (type === "chars") {
            // Split into characters
            elements = text.split("").map((char) => {
                const span = document.createElement("span");
                span.textContent = char === " " ? "\u00A0" : char;
                span.style.display = "inline-block";
                span.style.opacity = "0";
                span.style.transform = "translateY(20px)";
                textRef.current?.appendChild(span);
                return span;
            });
        } else if (type === "words") {
            // Split into words
            const words = text.split(" ");
            elements = words.map((word, index) => {
                const span = document.createElement("span");
                span.textContent = word;
                span.style.display = "inline-block";
                span.style.opacity = "0";
                span.style.transform = "translateY(20px)";
                span.style.marginRight = "0.25em";
                textRef.current?.appendChild(span);
                return span;
            });
        }

        // Animate with ScrollTrigger
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: stagger,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
        });

    }, [children, delay, stagger, type]);

    return (
        <div ref={textRef} className={className}>
            {children}
        </div>
    );
}
