"use client";

import { motion } from "framer-motion";

export default function Features() {
    const features = [
        {
            title: "AEROCELL MONOCOQUE",
            description: "Formula 1™ inspired carbon fibre construction."
        },
        {
            title: "ACTIVE LONG TAIL",
            description: "Extends 300mm rearward for Race Mode downforce."
        },
        {
            title: "E-MODULE",
            description: "Radial flux electric motor for instant torque fill."
        }
    ];

    return (
        <section className="py-24 bg-black text-white px-6 md:px-12 relative">
            {/* Section Separator */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-mclaren-orange shadow-[0_0_20px_rgba(255,135,0,0.5)] z-20" />
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="flex flex-col items-center"
                    >
                        {/* Orange Bar */}
                        <div className="w-12 h-1 bg-mclaren-orange mb-6" />

                        <h3 className="text-xl md:text-2xl font-bold font-orbitron uppercase tracking-widest mb-4">
                            {feature.title}
                        </h3>

                        <p className="text-gray-400 font-light tracking-wide text-sm md:text-base max-w-xs">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
