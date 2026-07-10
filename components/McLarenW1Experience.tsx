"use client";

import { MotionValue, motion, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { mclarenData } from "@/data/mclarenW1Data";
import { Rajdhani } from "next/font/google";
import { useState, useEffect, useRef } from "react";

interface McLarenW1ExperienceProps {
    scrollYProgress: MotionValue<number>;
    containerRef?: React.RefObject<HTMLElement | null>;
}

export default function McLarenW1Experience({ scrollYProgress, containerRef }: McLarenW1ExperienceProps) {
    // Interactive Mode State
    const [activeMode, setActiveMode] = useState("AERO");

    // MARVIN AI Chat Terminal States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "marvin"; text: string }>>([
        { role: "marvin", text: "MARVIN: Connection established. System online. I am ready to calibrate your McLaren W1. Detail your track coordinates, weather conditions, or speed targets to initiate telemetry modifications." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [aeroAngle, setAeroAngle] = useState(4); // default wing angle
    const [telemetryState, setTelemetryState] = useState("SYS_NOMINAL"); // default HUD state
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll chat container to bottom when messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    // Automatically focus input when chat opens
    useEffect(() => {
        if (isChatOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        }
    }, [isChatOpen]);

    // Toggle Navbar visibility when chat is opened/closed to prevent overlaps
    useEffect(() => {
        window.dispatchEvent(new CustomEvent("toggle-navbar", { detail: { hide: isChatOpen } }));
        return () => {
            window.dispatchEvent(new CustomEvent("toggle-navbar", { detail: { hide: false } }));
        };
    }, [isChatOpen]);

    // Sync HUD activeMode to scroll position
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        let targetMode = "AERO";
        if (latest >= 0.66) {
            targetMode = "RACE";
        } else if (latest >= 0.33) {
            targetMode = "TRACK";
        }
        
        setActiveMode((current) => {
            if (current !== targetMode) return targetMode;
            return current;
        });
    });

    // Interactively scroll to specific scroll sections on click
    const handleModeClick = (mode: string) => {
        setActiveMode(mode);
        if (!containerRef?.current) return;

        const container = containerRef.current;
        const containerHeight = container.scrollHeight;
        const scrollRange = containerHeight - window.innerHeight;

        let targetProgress = 0;
        if (mode === "AERO") targetProgress = 0.15;
        else if (mode === "TRACK") targetProgress = 0.5;
        else if (mode === "RACE") targetProgress = 0.83;

        const targetScrollTop = container.offsetTop + targetProgress * scrollRange;

        window.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
        });
    };

    // Chat Form Submit Handler
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userText = inputMessage.trim();
        setInputMessage("");
        setChatHistory((prev) => [...prev, { role: "user", text: userText }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        ...chatHistory.map((h) => ({ role: h.role, content: h.text })),
                        { role: "user", content: userText }
                    ]
                })
            });

            if (res.ok) {
                const data = await res.json();

                // Add Marvin reply
                setChatHistory((prev) => [...prev, { role: "marvin", text: data.reply }]);

                // Update dynamic telemetry variables in HUD
                if (data.aeroAngle !== undefined) setAeroAngle(data.aeroAngle);
                if (data.telemetryState !== undefined) setTelemetryState(data.telemetryState);

                // Auto scroll to target page section recommended by AI
                if (data.mode) {
                    handleModeClick(data.mode);
                }
            } else {
                throw new Error("API call failed");
            }
        } catch (err) {
            console.error("Chat terminal error:", err);
            setChatHistory((prev) => [
                ...prev,
                { role: "marvin", text: "SYSTEM ERROR: Telemetry uplink timeout. Failed to communicate with MARVIN central core." }
            ]);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    };

    // Phase Opacity Logic
    // Hero: 0 -> 0.33
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);

    // Design: 0.33 -> 0.66
    const designOpacity = useTransform(scrollYProgress, [0.33, 0.4, 0.6, 0.66], [0, 1, 1, 0]);

    // Engine: 0.66 -> 1.0
    const engineOpacity = useTransform(scrollYProgress, [0.66, 0.73, 1], [0, 1, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
            {/* LEFT HUD: Live AI Telemetry */}
            <div className="absolute left-8 top-28 hidden lg:flex flex-col gap-4 z-20 mix-blend-difference font-mono text-[10px] text-white/50 tracking-wider pointer-events-none">
                <div className="flex flex-col gap-1 border-l border-white/20 pl-3 py-1">
                    <span className="text-mclaren-orange text-[9px] font-orbitron tracking-widest font-bold">MARVIN telemetry</span>
                    <div className="flex flex-col gap-0.5 mt-2">
                        <div>SYS_REF: <span className="text-white font-bold">{telemetryState}</span></div>
                        <div>AERO_WING: <span className="text-white font-bold">{aeroAngle}°</span></div>
                        <div>DRIVE_MODE: <span className="text-mclaren-orange font-bold">{activeMode}</span></div>
                        <div className="flex gap-1 items-center mt-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">CALIBRATED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT CREATIVE: Mode Selector Visual */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-1 z-20 mix-blend-difference opacity-80 pointer-events-auto">
                {["AERO", "TRACK", "RACE"].map((mode, i) => (
                    <div key={mode} className="contents">
                        <button
                            onClick={() => handleModeClick(mode)}
                            className="flex items-center gap-3 text-xs font-orbitron tracking-widest transition-colors duration-300 font-bold text-white hover:text-mclaren-orange"
                        >
                            <span>{mode}</span>
                            <div className={`w-1.5 h-1.5 transition-all duration-300 ${activeMode === mode ? "bg-mclaren-orange shadow-[0_0_8px_#ff8700] animate-breathe scale-125" : "bg-white/20"}`} />
                        </button>
                        {i < 2 && <div className="w-4 h-[1px] bg-white/20 my-1 mr-1" />}
                    </div>
                ))}
            </div>

            {/* HERO PHASE */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="absolute inset-0 flex flex-col justify-between items-center text-center pt-24 pb-24 md:pt-4 md:pb-10"
            >
                <div>
                    <h1 className="text-4xl md:text-8xl font-bold tracking-tighter text-white uppercase drop-shadow-2xl">
                        McLaren <span className="text-mclaren-orange">W1</span>
                    </h1>
                </div>

                <div className="space-y-4 flex flex-col items-center mb-3">
                    <p className="text-xl md:text-2xl text-gray-300 tracking-[0.2em] font-bold uppercase">
                        {mclarenData.hero.subtitle}
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-mclaren-orange text-2xl tracking-widest font-orbitron">{mclarenData.hero.price}</p>
                    </div>
                </div>
            </motion.div>

            {/* DESIGN PHASE */}
            <motion.div
                style={{ opacity: designOpacity }}
                className="absolute inset-0 flex flex-col items-start justify-center p-12 md:p-24 max-w-2xl"
            >
                <div className="border-l-2 border-mclaren-orange pl-6">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                        {mclarenData.design.title}
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed font-light tracking-wide">
                        {mclarenData.design.text}
                    </p>
                </div>
            </motion.div>

            {/* ENGINE PHASE */}
            <motion.div
                style={{ opacity: engineOpacity }}
                className="absolute inset-0 flex flex-col items-end justify-center p-12 md:p-24"
            >
                <div className="text-right border-r-2 border-mclaren-orange pr-6 md:mr-8">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                        {mclarenData.engine.title}
                    </h2>
                    <div className="space-y-6">
                        {mclarenData.engine.specs.map((spec, i) => (
                            <div key={i} className="flex flex-col items-end">
                                <span className="text-4xl font-light text-white uppercase tracking-tighter">{spec.value}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">{spec.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* PROGRESS INDICATOR (Bottom) */}
            <motion.div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-mclaren-orange" style={{ scaleX: scrollYProgress, transformOrigin: "left" }} />
                </div>
            </motion.div>

            {/* BOTTOM RIGHT: Engage Marvin Button */}
            <div className="absolute right-4 md:right-8 bottom-24 z-20 pointer-events-auto">
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="px-4 py-2 border border-mclaren-orange/30 hover:border-mclaren-orange bg-black/40 hover:bg-mclaren-orange/15 text-white text-[10px] font-orbitron tracking-[0.2em] font-bold rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,135,0,0.1)]"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-mclaren-orange animate-pulse" />
                    <span>ENGAGE MARVIN AI</span>
                </button>
            </div>

            {/* MARVIN AI TERMINAL DRAWER */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-mclaren-black/90 backdrop-blur-md z-[60] border-l border-white/10 flex flex-col justify-between p-6 pointer-events-auto shadow-[-10px_0_50px_rgba(0,0,0,0.8)] font-mono text-xs"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/10 pb-3 font-orbitron">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] text-white/50 tracking-widest font-bold">MCLAREN ASSISTANT</span>
                                <span className="text-xs text-mclaren-orange font-bold tracking-wider">MARVIN AI v1.02</span>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-2 py-1 rounded text-[9px] uppercase tracking-wider cursor-pointer"
                            >
                                Close [X]
                            </button>
                        </div>

                        {/* Chat History */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto my-4 pr-2 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-mclaren-orange scrollbar-track-transparent">
                            {chatHistory.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col gap-1 ${
                                        msg.role === "user" ? "items-end" : "items-start"
                                    }`}
                                >
                                    <span
                                        className={`text-[8px] tracking-widest ${
                                            msg.role === "user" ? "text-white/40" : "text-mclaren-orange"
                                        }`}
                                    >
                                        {msg.role === "user" ? "DRV.CMD" : "MRV.SYS"}
                                    </span>
                                    <div
                                        className={`p-3 rounded-lg leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-white/5 text-white/90 border border-white/5 max-w-[85%]"
                                                : "bg-mclaren-orange/5 text-mclaren-orange border border-mclaren-orange/10 max-w-[85%]"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-[10px] text-mclaren-orange animate-pulse">
                                    <span className="w-1.5 h-1.5 bg-mclaren-orange rounded-full animate-pulse" />
                                    <span>MARVIN IS CALCULATING SETUP...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="flex flex-col gap-2 pt-3 border-t border-white/10">
                            <div className="text-[8px] text-white/40 tracking-wider font-semibold">DRIVER INPUT QUERY</div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-mclaren-orange/40 rounded-full px-4 py-2 transition-all">
                                <span className="text-mclaren-orange font-bold text-[10px]">&gt;</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type track coordinates or setup..."
                                    className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-white/30"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="text-[9px] font-bold text-mclaren-orange hover:text-white uppercase tracking-widest disabled:opacity-40 cursor-pointer"
                                >
                                    SEND
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
