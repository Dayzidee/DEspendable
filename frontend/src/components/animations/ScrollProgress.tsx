"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!progressRef.current || !fillRef.current) return;

        // Animate progress bar based on scroll
        gsap.to(fillRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            },
        });

        // Color transition based on scroll position
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const progress = self.progress;
                if (fillRef.current) {
                    if (progress < 0.33) {
                        fillRef.current.style.background = "linear-gradient(to right, #0018A8, #0025D9)";
                    } else if (progress < 0.66) {
                        fillRef.current.style.background = "linear-gradient(to right, #6366F1, #8B5CF6)";
                    } else {
                        fillRef.current.style.background = "linear-gradient(to right, #10B981, #059669)";
                    }
                }
            },
        });

    }, []);

    return (
        <div
            ref={progressRef}
            className="fixed top-0 left-0 right-0 h-1 bg-gray-200/30 z-50"
        >
            <div
                ref={fillRef}
                className="h-full origin-left scale-x-0"
                style={{
                    background: "linear-gradient(to right, #0018A8, #0025D9)",
                }}
            />
        </div>
    );
}
