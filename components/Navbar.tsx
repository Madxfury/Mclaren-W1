"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavbarProps {
    onInquireClick?: () => void;
}

export default function Navbar({ onInquireClick }: NavbarProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleToggleNavbar = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail && customEvent.detail.hide !== undefined) {
                setIsVisible(!customEvent.detail.hide);
            }
        };
        window.addEventListener("toggle-navbar", handleToggleNavbar);
        return () => {
            window.removeEventListener("toggle-navbar", handleToggleNavbar);
        };
    }, []);

    if (!isVisible) return null;
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 pt-3 pb-6 bg-transparent">
            <button
                onClick={() => {
                    const startY = window.scrollY;
                    const duration = 1000;
                    const startTime = performance.now();

                    const animateScroll = (timestamp: number) => {
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out cubic
                        const ease = 1 - Math.pow(1 - progress, 3);
                        window.scrollTo(0, startY * (1 - ease));

                        if (elapsed < duration) {
                            requestAnimationFrame(animateScroll);
                        } else {
                            // Optional: reload after reaching top if "reload" is strictly needed
                            // window.location.href = "/"; 
                        }
                    };

                    requestAnimationFrame(animateScroll);
                }}
                className="pointer-events-auto hover:opacity-100 transition-opacity"
            >
                <img
                    src="/mclaren-logo-full.png"
                    alt="McLaren"
                    className="h-4 md:h-25 w-auto"
                />
            </button>
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard"
                    className="px-4 py-2 text-[10px] md:text-xs font-bold tracking-widest text-white/70 border border-white/20 hover:border-mclaren-orange hover:text-mclaren-orange transition-all duration-300 uppercase rounded-full pointer-events-auto"
                >
                    Leads Portal
                </Link>
                <button
                    onClick={onInquireClick}
                    className="px-6 py-2 text-xs font-bold tracking-widest text-black bg-white hover:bg-mclaren-orange transition-colors duration-300 uppercase rounded-full pointer-events-auto"
                >
                    Inquire
                </button>
            </div>
        </nav>
    );
}
