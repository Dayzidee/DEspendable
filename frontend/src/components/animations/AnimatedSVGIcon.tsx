"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AnimatedSVGIconProps {
    svgPath: string;
    className?: string;
    drawDuration?: number;
    delay?: number;
    loop?: boolean;
}

export default function AnimatedSVGIcon({
    svgPath,
    className = "",
    drawDuration = 2,
    delay = 0,
    loop = false,
}: AnimatedSVGIconProps) {
    const svgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const paths = svgRef.current.querySelectorAll("path, line, polyline, circle, ellipse");

        // Set up paths for drawing animation
        paths.forEach((path) => {
            const element = path as SVGGeometryElement;
            const length = element.getTotalLength?.() || 0;

            if (length > 0) {
                gsap.set(element, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });
            }
        });

        // Create drawing animation
        const tl = gsap.timeline({
            repeat: loop ? -1 : 0,
            repeatDelay: loop ? 1 : 0,
            scrollTrigger: {
                trigger: svgRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        paths.forEach((path, index) => {
            const element = path as SVGGeometryElement;
            const length = element.getTotalLength?.() || 0;

            if (length > 0) {
                tl.to(
                    element,
                    {
                        strokeDashoffset: 0,
                        duration: drawDuration,
                        ease: "power2.inOut",
                    },
                    index * 0.1 + delay
                );
            }
        });

        // Add fill animation after drawing
        tl.to(
            paths,
            {
                fillOpacity: 1,
                duration: 0.5,
                stagger: 0.1,
            },
            `-=0.5`
        );

        return () => {
            tl.kill();
        };
    }, [svgPath, drawDuration, delay, loop]);

    return (
        <div
            ref={svgRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: svgPath }}
        />
    );
}
