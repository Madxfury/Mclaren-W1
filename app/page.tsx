"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import McLarenW1ScrollCanvas from "@/components/McLarenW1ScrollCanvas";
import McLarenW1Experience from "@/components/McLarenW1Experience";
import SpecsGrid from "@/components/SpecsGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import InquireModal from "@/components/InquireModal";
import ScrollProgress from "@/components/ScrollProgress";
import TelemetryLoader from "@/components/TelemetryLoader";

// Persistent flag in client-side SPA navigation memory
let hasStartedOnce = false;

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const [isInquireOpen, setIsInquireOpen] = useState(false);
  const [loadProgress, setLoadProgress] = useState(hasStartedOnce ? 100 : 0); // Animated visual progress
  const [actualProgress, setActualProgress] = useState(hasStartedOnce ? 100 : 0); // Actual asset load progress
  const [isLoaded, setIsLoaded] = useState(hasStartedOnce);

  // Master Scroll Controller - 600vh total height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Lock scrolling during preloading & reset scroll position on mount
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    
    // Only lock and scroll to top on first startup
    if (!hasStartedOnce) {
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Smoothly interpolate loadProgress to actualProgress
  useEffect(() => {
    if (hasStartedOnce) return;
    if (loadProgress >= actualProgress) return;

    // Tick up every 55ms to create a balanced, premium loading duration
    const timer = setTimeout(() => {
      setLoadProgress((prev) => {
        const remaining = actualProgress - prev;
        // Eased step for balanced telemetry diagnostic visualization
        const step = Math.max(1, Math.floor(remaining * 0.05));
        return Math.min(prev + step, actualProgress);
      });
    }, 55);

    return () => clearTimeout(timer);
  }, [loadProgress, actualProgress]);

  // Unlock scrolling once loaded
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isLoaded]);

  return (
    <main className="bg-mclaren-black min-h-screen">
      <TelemetryLoader
        progress={loadProgress}
        isLoaded={isLoaded}
        onStartEngine={() => {
          hasStartedOnce = true;
          setIsLoaded(true);
        }}
      />
      
      <Navbar onInquireClick={() => setIsInquireOpen(true)} />

      <AnimatePresence>
        {isInquireOpen && <InquireModal onClose={() => setIsInquireOpen(false)} />}
      </AnimatePresence>

      {/* SCROLL-LOCKED SEQUENCE */}
      {/* 
         Structure:
         - containerRef: 600vh height to create scroll space
         - sticky child: pinned to viewport for the duration
         - canvas & HUD: render based on scrollYProgress from the container
      */}
      <section ref={containerRef} className="h-[600vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden block">
          <McLarenW1ScrollCanvas
            scrollYProgress={scrollYProgress}
            totalFrames={216}
            imageFolderPath="/McLaren Frames"
            onProgress={(p) => setActualProgress(p)}
            onLoaded={() => {
              // Handled by progress interpolation loop
            }}
          />
          <McLarenW1Experience scrollYProgress={scrollYProgress} containerRef={containerRef} />
          <ScrollProgress scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* POST-SEQUENCE CONTENT */}
      <div className="relative z-20 bg-mclaren-black">
        <SpecsGrid />
        <Features />
        <Footer />
      </div>
    </main >
  );
}
