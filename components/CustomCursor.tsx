"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position values
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring physics for the outer ring (lag effect)
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const manageMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);
        };

        const manageMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Detect hover on interactive elements
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.hasAttribute("data-hoverable")
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mouseover", manageMouseOver);

        return () => {
            window.removeEventListener("mousemove", manageMouseMove);
            window.removeEventListener("mouseover", manageMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Precision Dot - Follows Instantly */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-mclaren-orange rounded-full pointer-events-none z-[10000]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovered ? 0 : 1, // Hide dot when ring expands
                }}
            />

            {/* Magnetic Ring - Follows with Physics */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[10000] border border-mclaren-orange"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovered ? 2 : 1, // Expand on hover
                    backgroundColor: isHovered ? "rgba(255, 135, 0, 0.1)" : "transparent", // Subtle tint
                    borderColor: isHovered ? "rgba(255, 135, 0, 0.8)" : "rgba(255, 135, 0, 0.4)",
                    borderWidth: isHovered ? "1px" : "1px",
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
            >
                {/* Inner crosshair or detail for futuristic look (optional, keeping clean for now) */}
            </motion.div>
        </>
    );
}
