"use client";

import { mclarenData } from "@/data/mclarenW1Data";
import { motion } from "framer-motion";

export default function SpecsGrid() {
    return (
        <section className="py-32 px-6 md:px-12 bg-mclaren-carbon relative overflow-hidden">
            {/* Background Tech Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Section Separator */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-mclaren-orange shadow-[0_0_20px_rgba(255,135,0,0.5)] z-20" />
            {/* Radial Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-white/10 pb-6"
                >
                    <div>
                        <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-widest font-orbitron mb-2">
                            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-white">Specs</span>
                        </h3>
                        <p className="text-white/40 font-mono text-xs tracking-widest uppercase">
                            // Mclaren Automotive Systems // W1.SYS.01
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-mclaren-orange/80 text-xs tracking-[0.3em] uppercase mt-4 md:mt-0 font-mono">
                        <span className="w-2 h-2 bg-mclaren-orange rounded-full animate-breathe" />
                        System Online
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mclarenData.specsGrid.map((spec, i) => (
                        <Card key={i} spec={spec} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Card({ spec, index }: { spec: { label: string; value: string }; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-48"
        >
            {/* Chamfered Border Container using Clip Path */}
            <div
                className="absolute inset-0 bg-white/10 transition-colors duration-500 group-hover:bg-accent-gold/60"
                style={{
                    clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
                }}
            >
                {/* Inner Content Container (Slightly smaller to create border effect) */}
                <div
                    className="absolute inset-[1px] bg-[#0A0A0A] backdrop-blur-sm transition-all duration-500 group-hover:inset-[2px]"
                    style={{
                        clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
                    }}
                >
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-gold/5 to-transparent h-[200%] w-full -translate-y-full group-hover:animate-scan" />

                    {/* Corner Decorations */}
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M0 0H20V20" stroke="currentColor" className="text-white/20 group-hover:text-accent-gold transition-colors duration-300" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                        <motion.span
                            className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tighter font-orbitron relative"
                            whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(255,255,255,0.5)" }}
                        >
                            <span className="relative z-10">{spec.value}</span>
                            <span className="absolute top-0 left-0 text-accent-gold/20 blur-sm z-0">{spec.value}</span>
                        </motion.span>

                        <div className="h-px w-8 bg-white/20 mt-2 mb-4 group-hover:w-24 group-hover:bg-accent-gold transition-all duration-500" />

                        <span className="text-xs text-gray-400 font-mono uppercase tracking-[0.2em] group-hover:text-accent-gold transition-colors duration-300">
                            {spec.label}
                        </span>
                    </div>

                    {/* Technical Decals */}
                    <div className="absolute bottom-4 left-6 text-[0.5rem] text-white/20 font-mono">
                        // 0{index + 1}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
