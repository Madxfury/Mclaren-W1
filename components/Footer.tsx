"use client";

export default function Footer() {
    const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const duration = 2500; // 2.5 seconds for a slow, cinematic reverse
        const start = window.scrollY;
        const startTime = performance.now();

        const easeInOutCubic = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-gold/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold font-orbitron text-accent-gold tracking-widest uppercase">
                            MCLAREN
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light tracking-wide">
                            Born on the track. Built for the road. The W1 represents the pinnacle of hybrid performance and aerodynamic design.
                        </p>
                    </div>

                    {/* Explore Column */}
                    <div>
                        <h3 className="text-accent-gold font-bold uppercase tracking-widest mb-6 text-sm">Explore</h3>
                        <ul className="space-y-4">
                            {["Models", "Heritage", "Technology", "Art"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        onClick={handleScrollToTop}
                                        className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider block"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-accent-gold font-bold uppercase tracking-widest mb-6 text-sm">Support</h3>
                        <ul className="space-y-4">
                            {["Contact", "Dealers", "Service", "Press"].map((item) => {
                                const isContact = item === "Contact";
                                return (
                                    <li key={item}>
                                        <a
                                            href={isContact ? "https://www.linkedin.com/in/sanskarparab/" : "#"}
                                            target={isContact ? "_blank" : undefined}
                                            rel={isContact ? "noopener noreferrer" : undefined}
                                            onClick={isContact ? undefined : handleScrollToTop}
                                            className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider block"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h3 className="text-accent-gold font-bold uppercase tracking-widest mb-6 text-sm">Stay Updated</h3>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold transition-colors placeholder:text-white/20"
                            />
                            <button className="w-full bg-accent-gold text-black font-bold uppercase tracking-widest py-3 text-sm hover:bg-white transition-colors clip-path-slant">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} Mclaren Automotive Limited.</p>
                    <a
                        href="https://www.linkedin.com/in/sanskarparab/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:block text-white transition-all duration-300 hover:scale-105 hover:text-mclaren-orange inline-block transform origin-center cursor-pointer"
                    >
                        Made with ❤️‍🔥 by Sanskar
                    </a>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
