import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

// Use useLayoutEffect on client, useEffect on server (for SSR compatibility)
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Custom hook for GSAP animations in React
 * Provides automatic cleanup and scoped context
 * 
 * @param callback - Function containing GSAP animations
 * @param dependencies - Dependency array (like useEffect)
 * @returns Context object with selector scoping
 */
export const useGSAP = (
    callback: (context: gsap.Context) => void | (() => void),
    dependencies: React.DependencyList = []
) => {
    const contextRef = useRef<gsap.Context | null>(null);

    useIsomorphicLayoutEffect(() => {
        // Create a new GSAP context
        contextRef.current = gsap.context(() => {
            callback(contextRef.current!);
        });

        // Cleanup function
        return () => {
            contextRef.current?.revert();
        };
    }, dependencies);

    return contextRef;
};

/**
 * Hook for creating a scoped GSAP context with a specific container
 * Useful for component-scoped animations
 * 
 * @param scope - Ref to the container element
 * @returns Context ref and helper functions
 */
export const useGSAPContext = (scope?: React.RefObject<HTMLElement>) => {
    const contextRef = useRef<gsap.Context | null>(null);

    useIsomorphicLayoutEffect(() => {
        contextRef.current = gsap.context(() => { }, scope?.current || undefined);

        return () => {
            contextRef.current?.revert();
        };
    }, [scope]);

    const animate = (
        target: gsap.TweenTarget,
        vars: gsap.TweenVars
    ) => {
        if (!contextRef.current) return null;
        return contextRef.current.add(() => gsap.to(target, vars));
    };

    const animateFrom = (
        target: gsap.TweenTarget,
        vars: gsap.TweenVars
    ) => {
        if (!contextRef.current) return null;
        return contextRef.current.add(() => gsap.from(target, vars));
    };

    const timeline = (vars?: gsap.TimelineVars) => {
        if (!contextRef.current) return null;
        return contextRef.current.add(() => gsap.timeline(vars));
    };

    return {
        contextRef,
        animate,
        animateFrom,
        timeline,
    };
};

/**
 * Hook for scroll-triggered animations
 * Automatically handles ScrollTrigger cleanup
 */
export const useScrollTrigger = (
    callback: () => void | (() => void),
    dependencies: React.DependencyList = []
) => {
    useIsomorphicLayoutEffect(() => {
        const cleanup = callback();

        return () => {
            if (typeof cleanup === "function") {
                cleanup();
            }
        };
    }, dependencies);
};
