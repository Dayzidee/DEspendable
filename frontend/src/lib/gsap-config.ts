import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register GSAP plugins only if window is defined (Client Side)
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

// Configure GSAP defaults
gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
});

if (typeof window !== "undefined") {
    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
        toggleActions: "play none none reverse",
        markers: false, // Set to true for debugging
    });
}

// Custom easing functions
export const customEases = {
    smooth: "power2.inOut",
    elastic: "elastic.out(1, 0.5)",
    bounce: "bounce.out",
    snap: "power4.inOut",
};

// Animation presets
export const animationPresets = {
    fadeIn: {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
    },
    fadeInUp: {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
    },
    fadeInLeft: {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power2.out",
    },
    fadeInRight: {
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: "power2.out",
    },
    scaleIn: {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "back.out(1.4)",
    },
    slideInUp: {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
    },
    drawSVG: {
        drawSVG: "0%",
        duration: 1.5,
        ease: "power2.inOut",
    },
};

// Stagger configurations
export const staggerPresets = {
    fast: {
        amount: 0.3,
        from: "start",
    },
    medium: {
        amount: 0.6,
        from: "start",
    },
    slow: {
        amount: 1,
        from: "start",
    },
    center: {
        amount: 0.5,
        from: "center",
    },
};

// Utility function to create scroll-triggered animation
export const createScrollTrigger = (
    trigger: string | Element,
    animation: gsap.TweenVars,
    options?: ScrollTrigger.Vars
) => {
    return gsap.to(trigger, {
        ...animation,
        scrollTrigger: {
            trigger,
            start: "top 80%",
            end: "bottom 20%",
            ...options,
        },
    });
};

// Utility function for parallax effect
export const createParallax = (
    element: string | Element,
    speed: number = 0.5
) => {
    if (typeof window === 'undefined') return gsap.to({}, {});

    return gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: "none",
        scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        },
    });
};

// Utility function for magnetic effect
export const createMagneticEffect = (
    element: HTMLElement,
    strength: number = 0.3
) => {
    if (typeof window === 'undefined') return () => {};

    const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        gsap.to(element, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
        });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
    };
};

export { gsap, ScrollTrigger };
