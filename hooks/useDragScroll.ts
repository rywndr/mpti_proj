/**
 * Custom React hook that enables drag-to-scroll functionality on any scrollable element.
 * Provides intuitive click-and-drag behavior for horizontal and vertical scrolling.
 */

import { useEffect, useRef, useState } from "react";

interface UseDragScrollOptions {
    /** Enable horizontal scrolling (default: true) */
    horizontal?: boolean;
    /** Enable vertical scrolling (default: true) */
    vertical?: boolean;
    /** Scroll sensitivity multiplier (default: 1) */
    sensitivity?: number;
    /** Minimum distance in pixels to trigger drag (default: 5) */
    dragThreshold?: number;
}

/**
 * Custom hook for drag-to-scroll functionality
 *
 * @param options - Configuration options for drag behavior
 * @returns Ref to attach to the scrollable element and active state
 */
export function useDragScroll<T extends HTMLElement>(
    options: UseDragScrollOptions = {},
) {
    const {
        horizontal = true,
        vertical = true,
        sensitivity = 1,
        dragThreshold = 5,
    } = options;

    const ref = useRef<T>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
    const hasDragged = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let animationFrameId: number | null = null;

        /**
         * Handle mouse down - Start dragging
         */
        const handleMouseDown = (e: MouseEvent) => {
            // Ignore if clicking on interactive elements
            const target = e.target as HTMLElement;
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.tagName === "INPUT" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                return;
            }

            setIsDragging(true);
            setStartPos({ x: e.pageX, y: e.pageY });
            setScrollPos({
                x: element.scrollLeft,
                y: element.scrollTop,
            });
            hasDragged.current = false;

            // Don't prevent default yet - let clicks through
        };

        /**
         * Handle mouse move - Perform scrolling
         */
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const dx = e.pageX - startPos.x;
            const dy = e.pageY - startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if movement exceeds threshold
            if (distance > dragThreshold) {
                hasDragged.current = true;

                // Cancel any pending animation frame
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                }

                // Use requestAnimationFrame for smooth scrolling
                animationFrameId = requestAnimationFrame(() => {
                    if (horizontal) {
                        element.scrollLeft = scrollPos.x - dx * sensitivity;
                    }

                    if (vertical) {
                        element.scrollTop = scrollPos.y - dy * sensitivity;
                    }
                });

                // Prevent text selection while dragging
                e.preventDefault();
            }
        };

        /**
         * Handle mouse up - Stop dragging
         */
        const handleMouseUp = (e: MouseEvent) => {
            // If we didn't actually drag, allow the click to propagate
            if (!hasDragged.current) {
                // This was a click, not a drag - do nothing to let click handlers work
            } else {
                // This was a drag, prevent any click events
                e.preventDefault();
            }

            setIsDragging(false);
            hasDragged.current = false;

            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        /**
         * Handle mouse leave - Stop dragging when leaving window
         */
        const handleMouseLeave = (e: MouseEvent) => {
            // Only stop if leaving the document entirely
            if (
                e.relatedTarget === null ||
                !(e.relatedTarget instanceof Node) ||
                !document.contains(e.relatedTarget)
            ) {
                setIsDragging(false);

                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        };

        // Add event listeners
        element.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Cleanup
        return () => {
            element.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseleave", handleMouseLeave);

            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [
        isDragging,
        startPos,
        scrollPos,
        horizontal,
        vertical,
        sensitivity,
        dragThreshold,
    ]);

    return {
        ref,
        isDragging,
    };
}
