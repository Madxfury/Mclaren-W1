"use client";

import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface ScrollProgressProps {
    scrollYProgress: MotionValue<number>;
}

export default function ScrollProgress({ scrollYProgress }: ScrollProgressProps) {
    const [activeSection, setActiveSection] = useState(0);
    const isManual = useRef(false);
    const targetSection = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Map scroll progress to section index
    useEffect(() => {
        return scrollYProgress.onChange((latest) => {
            let currentSection = 0;
            // Adjusted thresholds for better visual sync
            // Design starts appearing around 0.33, so we switch slightly earlier at 0.3
            // Powertrain starts around 0.66, switch at 0.63
            if (latest < 0.3) {
                currentSection = 0;
            } else if (latest < 0.63) {
                currentSection = 1;
            } else {
                currentSection = 2;
            }

            if (isManual.current) {
                if (currentSection === targetSection.current) {
                    isManual.current = false;
                } else {
                    return;
                }
            }

            setActiveSection(currentSection);
        });
    }, [scrollYProgress]);

    const handleScrollTo = (index: number) => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        let targetScroll = 0;

        if (index === 0) targetScroll = 0;
        if (index === 1) targetScroll = totalHeight * 0.33;
        if (index === 2) targetScroll = totalHeight * 0.66;

        // Optimistic update
        isManual.current = true;
        targetSection.current = index;
        setActiveSection(index);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            isManual.current = false;
        }, 2000); // Increased timeout to ensure scroll completion

        window.scrollTo({
            top: targetScroll,
            behavior: "smooth"
        });
    };

    const sections = [
        { id: 0, label: "01 START" },
        { id: 1, label: "02 DESIGN" },
        { id: 2, label: "03 POWERTRAIN" },
    ];

    return (
        <motion.div
            className="absolute bottom-10 left-10 z-40 hidden md:flex flex-col items-center gap-1"
        >
            {sections.map((section, index) => {
                const isActive = activeSection === index;
                return (
                    <button
                        key={section.id}
                        onClick={() => handleScrollTo(index)}
                        className="relative px-6 py-2 rounded-full flex items-center justify-start w-full min-w-[140px]"
                        style={{ isolation: "isolate" }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activePillVertical"
                                className="absolute inset-0 bg-mclaren-orange rounded-full -z-10"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span
                            className={clsx(
                                "text-xs font-bold tracking-widest uppercase transition-colors duration-200 font-rajdhani",
                                isActive ? "text-black" : "text-white/60"
                            )}
                        >
                            {section.label}
                        </span>
                    </button>
                );
            })}
        </motion.div>
    );
}
