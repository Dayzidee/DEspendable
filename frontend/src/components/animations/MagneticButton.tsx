"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "@/lib/gsap-config";
import { Link } from "@/i18n/navigation";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number;
    onClick?: () => void;
    href?: string;
}

export default function MagneticButton({
    children,
    className = "",
    strength = 0.3,
    onClick,
    href,
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;
        if (!button || !text) return;

        const handleMouseMove = (e: Event) => {
            const mouseEvent = e as globalThis.MouseEvent;
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (mouseEvent.clientX - centerX) * strength;
            const deltaY = (mouseEvent.clientY - centerY) * strength;

            gsap.to(button, {
                x: deltaX,
                y: deltaY,
                duration: 0.3,
                ease: "power2.out",
            });

            gsap.to(text, {
                x: deltaX * 0.5,
                y: deltaY * 0.5,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)",
            });

            gsap.to(text, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)",
            });
        };

        const handleMouseEnter = () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);
        button.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
            button.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [strength]);

    // Use Link component if it's a link, otherwise button
    const Component = href ? Link : "button";

    // If it's a Link, we need to pass href. If button, we pass onClick.
    // For Link, we don't pass onClick usually unless needed, but here we might need it?
    // MagneticButton implementation uses onClick for button.
    // Link component from navigation handles href.

    if (href) {
        return (
            <Link
                ref={buttonRef as any}
                className={`relative inline-block ${className}`}
                href={href}
                onClick={onClick}
            >
                <span ref={textRef} className="block">
                    {children}
                </span>
            </Link>
        );
    }

    return (
        <button
            ref={buttonRef as any}
            className={`relative inline-block ${className}`}
            onClick={onClick}
        >
            <span ref={textRef} className="block">
                {children}
            </span>
        </button>
    );
}
