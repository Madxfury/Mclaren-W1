"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TelemetryLoaderProps {
    progress: number;
    isLoaded: boolean;
    onStartEngine?: () => void;
}

const telemetryLogs = [
    { pct: 0, label: "INIT", text: "SYSTEM DIAGNOSTICS INITIATED" },
    { pct: 12, label: "CHAS", text: "MCLAREN AEROCELL INTEGRITY: 100%" },
    { pct: 28, label: "AERO", text: "ACTIVE FRONT ANHEDRAL WINGS: ENGAGED" },
    { pct: 45, label: "WING", text: "ACTIVE LONG TAIL EXTENSION (300MM): CALIBRATED" },
    { pct: 60, label: "ENG", text: "V8 TWIN-TURBO POWER COUPLING: READY" },
    { pct: 75, label: "E-MOD", text: "RADIAL FLUX ELECTRIC MOTOR SENSORS: ONLINE" },
    { pct: 88, label: "SUSP", text: "RACE ACTIVE SUSPENSION HYDRAULICS: PRESSURE NOMINAL" },
    { pct: 96, label: "BUFF", text: "HOLOGRAPHIC FRAME ENGINE PREBUFFER (216 FRAMES): 100%" },
    { pct: 100, label: "SYS", text: "W1 DRIVETRAIN READY. SYSTEMS ONLINE." }
];

const playShutterSound = (ctx: AudioContext) => {
    try {
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const now = ctx.currentTime;

        // 1. Pneumatic Lock Release Click
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(120, now);
        clickOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.05);
        clickGain.gain.setValueAtTime(0.18, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.07);

        // 2. High-Frequency Pneumatic Hiss (White Noise + Highpass)
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const hissNode = ctx.createBufferSource();
        hissNode.buffer = buffer;
        const hissFilter = ctx.createBiquadFilter();
        hissFilter.type = "highpass";
        hissFilter.frequency.setValueAtTime(2800, now);
        const hissGain = ctx.createGain();
        hissGain.gain.setValueAtTime(0.06, now);
        hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        hissNode.connect(hissFilter);
        hissFilter.connect(hissGain);
        hissGain.connect(ctx.destination);
        hissNode.start(now);
        hissNode.stop(now + 0.8);

        // 3. Low Hydraulic Motor Whir (Triangle + Lowpass)
        const motorOsc = ctx.createOscillator();
        const motorGain = ctx.createGain();
        motorOsc.type = "triangle";
        motorOsc.frequency.setValueAtTime(70, now);
        motorOsc.frequency.linearRampToValueAtTime(60, now + 0.95);
        const motorFilter = ctx.createBiquadFilter();
        motorFilter.type = "lowpass";
        motorFilter.frequency.setValueAtTime(130, now);
        motorGain.gain.setValueAtTime(0.0, now);
        motorGain.gain.linearRampToValueAtTime(0.15, now + 0.15);
        motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
        motorOsc.connect(motorFilter);
        motorFilter.connect(motorGain);
        motorGain.connect(ctx.destination);
        motorOsc.start(now);
        motorOsc.stop(now + 1.0);

        // 4. Metallic Roller Scrape (White Noise + Bandpass Sweep)
        const scrapeNode = ctx.createBufferSource();
        scrapeNode.buffer = buffer;
        const scrapeFilter = ctx.createBiquadFilter();
        scrapeFilter.type = "bandpass";
        scrapeFilter.frequency.setValueAtTime(350, now);
        scrapeFilter.frequency.exponentialRampToValueAtTime(1000, now + 0.85);
        scrapeFilter.Q.setValueAtTime(3.5, now);
        const scrapeGain = ctx.createGain();
        scrapeGain.gain.setValueAtTime(0.0, now);
        scrapeGain.gain.linearRampToValueAtTime(0.03, now + 0.12);
        scrapeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        scrapeNode.connect(scrapeFilter);
        scrapeFilter.connect(scrapeGain);
        scrapeGain.connect(ctx.destination);
        scrapeNode.start(now);
        scrapeNode.stop(now + 0.9);

    } catch (err) {
        console.warn("Audio Context playback error:", err);
    }
};

const playBeep = (ctx: AudioContext) => {
    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    } catch (e) {
        // Safe fail
    }
};

export default function TelemetryLoader({ progress, isLoaded, onStartEngine }: TelemetryLoaderProps) {
    const [shouldRender, setShouldRender] = useState(true);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
    const [audioEnabled, setAudioEnabled] = useState(true);

    // Initialize audio context utility
    const initAudio = () => {
        if (audioCtx) return audioCtx;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return null;
        const ctx = new AudioContextClass();
        setAudioCtx(ctx);
        return ctx;
    };

    // Explicit user click handler on the HUD button
    const handleToggleAudio = () => {
        const ctx = initAudio();
        if (!ctx) return;

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        if (!audioEnabled) {
            playBeep(ctx);
            setAudioEnabled(true);
        } else {
            setAudioEnabled(false);
        }
    };

    // Auto-unlock audio if the user clicks or touches anywhere during loading
    useEffect(() => {
        const handleGesture = () => {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;

            setAudioCtx((prev) => {
                if (prev) {
                    if (prev.state === "suspended") prev.resume();
                    setAudioEnabled(true);
                    return prev;
                }
                const ctx = new AudioContextClass();
                setAudioEnabled(true);
                return ctx;
            });
        };

        window.addEventListener("click", handleGesture);
        window.addEventListener("touchstart", handleGesture);

        return () => {
            window.removeEventListener("click", handleGesture);
            window.removeEventListener("touchstart", handleGesture);
        };
    }, []);

    // Play sound and trigger ignition
    const handleStartEngineClick = () => {
        const ctx = initAudio();
        if (audioEnabled && ctx) {
            if (ctx.state === "suspended") {
                ctx.resume();
            }
            playShutterSound(ctx);
        }
        if (onStartEngine) {
            onStartEngine();
        }
    };

    // Keep it in DOM until exit transition is finished
    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 1200); // Allow 1.2s for the slide-up animation to complete
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {!isLoaded && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } // Heavy mechanical garage-door ease
                    }}
                    className="fixed inset-0 bg-mclaren-black z-[9999] flex flex-col justify-between p-6 md:p-12 select-none overflow-hidden loading-active border-b border-mclaren-orange/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                >
                    {/* Top Status HUD */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 font-orbitron text-[9px] md:text-xs tracking-[0.2em] text-white/50">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-mclaren-orange rounded-full animate-ping" />
                            <span>MCLAREN AUTOMOTIVE | HYPERCAR DIVISION</span>
                        </div>
                        <div className="hidden sm:block">SYS_REF: W1_PROTOTYPE</div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleToggleAudio}
                                className={`pointer-events-auto border px-2.5 py-0.5 rounded transition-all duration-300 font-bold tracking-widest text-[8px] md:text-[10px] ${
                                    audioEnabled
                                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse"
                                        : "border-white/20 text-white/40 hover:text-white/80 hover:border-white/40 bg-transparent cursor-pointer"
                                }`}
                            >
                                AUDIO: {audioEnabled ? "ONLINE" : "MUTED"}
                            </button>
                        </div>
                    </div>

                    {/* Center Glowing Logo & Progress */}
                    <div className="flex flex-col items-center justify-center gap-6 my-auto">
                        <div
                            className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center"
                        >
                            <img
                                src="/mclaren-speedmark.png"
                                alt="McLaren Speedmark"
                                className="w-full h-auto object-contain opacity-90"
                            />
                        </div>

                        {progress < 100 ? (
                            <div className="flex flex-col items-center gap-2 w-full max-w-md">
                                <div className="flex justify-between w-full font-orbitron text-xs tracking-wider">
                                    <span className="text-white/60">SYSTEM CALIBRATING...</span>
                                    <span className="text-mclaren-orange font-bold font-mono">{progress}%</span>
                                </div>
                                
                                {/* Technical Progress Bar */}
                                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-mclaren-orange to-[#ffd000] transition-all duration-100 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                key="start-engine-btn"
                                onClick={handleStartEngineClick}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="pointer-events-auto px-8 py-3.5 bg-mclaren-orange text-black font-orbitron font-bold tracking-[0.25em] text-xs md:text-sm rounded-full shadow-2xl hover:bg-white hover:text-black transition-all duration-300 uppercase cursor-pointer"
                            >
                                START ENGINE
                            </motion.button>
                        )}
                    </div>

                    {/* Bottom Console Tech-Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-white/10 pt-4">
                        <div className="col-span-1 md:col-span-8 font-mono text-[9px] md:text-[11px] leading-relaxed text-white/40 max-h-32 overflow-hidden flex flex-col gap-1 justify-end">
                            {telemetryLogs.map((log) => {
                                const active = progress >= log.pct;
                                if (!active) return null;
                                return (
                                    <motion.div
                                        key={log.pct}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 font-semibold"
                                    >
                                        <span className="text-mclaren-orange">[{log.label}]</span>
                                        <span>{log.text}</span>
                                        <span className="text-emerald-500 font-bold ml-auto">[ OK ]</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        <div className="col-span-1 md:col-span-4 flex flex-col items-end gap-1 font-orbitron">
                            <div className="text-[10px] text-white/30 tracking-widest uppercase">POWERTRAIN INTEGRATION</div>
                            <div className="text-sm md:text-lg font-bold text-white tracking-widest uppercase">
                                {progress < 50 ? (
                                    <span className="text-white/60">STANDBY</span>
                                ) : progress < 75 ? (
                                    <span className="text-blue-400">CHARGING</span>
                                ) : progress < 100 ? (
                                    <span className="text-mclaren-orange">E-MODULE ACTIVE</span>
                                ) : (
                                    <span className="text-emerald-500 animate-pulse">READY FOR IGNITION</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
