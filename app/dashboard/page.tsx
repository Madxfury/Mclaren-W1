"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Inquiry {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    retailer: string;
    message: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch leads on mount
    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/inquire");
            if (res.ok) {
                const data = await res.json();
                setInquiries(data.inquiries || []);
            }
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Purge lead record from database
    const handlePurge = async (id: string) => {
        if (!confirm("Are you sure you want to purge this record from the database?")) return;

        try {
            const res = await fetch(`/api/inquire?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                // Refresh list
                setInquiries(prev => prev.filter(inq => inq.id !== id));
            } else {
                alert("Failed to delete lead");
            }
        } catch (err) {
            console.error("Purge error:", err);
        }
    };

    // Filter leads based on query
    const filteredLeads = inquiries.filter(lead => {
        const query = searchQuery.toLowerCase();
        return (
            lead.firstName.toLowerCase().includes(query) ||
            lead.lastName.toLowerCase().includes(query) ||
            lead.email.toLowerCase().includes(query) ||
            lead.retailer.toLowerCase().includes(query) ||
            lead.country.toLowerCase().includes(query)
        );
    });

    // Stats calculations
    const totalLeads = inquiries.length;
    const uniqueCountries = new Set(inquiries.map(l => l.country)).size;
    const topRetailer = inquiries.reduce((acc, current) => {
        acc[current.retailer] = (acc[current.retailer] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const mostPopularRetailer = Object.entries(topRetailer).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return (
        <div className="min-h-screen bg-mclaren-black text-white font-mono p-6 md:p-12 selection:bg-mclaren-orange selection:text-black">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4 relative z-10">
                <div>
                    <div className="flex items-center gap-2 text-[10px] text-mclaren-orange tracking-widest font-orbitron mb-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-mclaren-orange animate-pulse" />
                        <span>MCLAREN CONTROL GATEWAY // SECURE PORTAL</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold font-orbitron tracking-wider uppercase text-white">
                        SHOWROOM LEADS <span className="text-mclaren-orange">DATABASE</span>
                    </h1>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 border border-white/10 hover:border-mclaren-orange bg-white/5 hover:bg-mclaren-orange/10 text-white hover:text-mclaren-orange text-xs font-orbitron tracking-widest rounded-full transition-all duration-300 uppercase cursor-pointer"
                >
                    &lt; Back to Showroom
                </Link>
            </header>

            {/* Stats Dashboard Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                <div className="border border-white/10 bg-white/5 p-5 rounded-lg flex flex-col justify-between h-28 relative overflow-hidden">
                    <span className="text-[10px] text-white/40 tracking-widest font-semibold uppercase">TOTAL INQUIRY LEADS</span>
                    <span className="text-4xl font-bold font-orbitron text-white">{totalLeads}</span>
                    <div className="absolute right-0 bottom-0 text-7xl font-bold text-white/5 -mb-6 -mr-2 pointer-events-none select-none font-orbitron">SYS</div>
                </div>
                <div className="border border-white/10 bg-white/5 p-5 rounded-lg flex flex-col justify-between h-28 relative overflow-hidden">
                    <span className="text-[10px] text-white/40 tracking-widest font-semibold uppercase">ACTIVE GLOBAL MARKETS</span>
                    <span className="text-4xl font-bold font-orbitron text-mclaren-orange">{uniqueCountries}</span>
                    <div className="absolute right-0 bottom-0 text-7xl font-bold text-white/5 -mb-6 -mr-2 pointer-events-none select-none font-orbitron">GLO</div>
                </div>
                <div className="border border-white/10 bg-white/5 p-5 rounded-lg flex flex-col justify-between h-28 relative overflow-hidden">
                    <span className="text-[10px] text-white/40 tracking-widest font-semibold uppercase">TOP RETAILER SOURCE</span>
                    <span className="text-sm font-bold font-orbitron text-white truncate max-w-full uppercase mt-2">{mostPopularRetailer}</span>
                    <div className="absolute right-0 bottom-0 text-7xl font-bold text-white/5 -mb-6 -mr-2 pointer-events-none select-none font-orbitron">RTL</div>
                </div>
            </section>

            {/* Data Controller / Search */}
            <section className="border border-white/10 bg-white/5 p-4 rounded-lg mb-8 relative z-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 focus-within:border-mclaren-orange/40 rounded-full px-4 py-2 w-full md:max-w-md transition-all">
                    <span className="text-mclaren-orange font-bold text-sm">&gt;</span>
                    <input
                        type="text"
                        placeholder="FILTER BY CLIENT NAME, EMAIL, COUNTRY OR SHOWROOM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-white/30 uppercase font-mono"
                    />
                </div>
                <div className="text-[10px] text-white/30 font-semibold tracking-wider">
                    DATABASE PATH: <span className="text-white/60">/data/inquiries.json</span>
                </div>
            </section>

            {/* Lead list Content */}
            <main className="border border-white/10 bg-black/40 rounded-lg overflow-hidden relative z-10">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
                        <span className="w-2 h-2 rounded-full bg-mclaren-orange animate-ping" />
                        <span className="text-xs font-orbitron tracking-widest uppercase">TUNING DATABASE FREQUENCY...</span>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-white/30">
                        <span className="text-sm font-orbitron tracking-wider">NO CORRESPONDING LEADS REGISTERED</span>
                        <span className="text-[10px] uppercase">SYSTEM STANDBY</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-mono text-xs">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-white/50 tracking-wider text-[10px]">
                                    <th className="p-4 uppercase font-semibold">Client Name</th>
                                    <th className="p-4 uppercase font-semibold">Contact Info</th>
                                    <th className="p-4 uppercase font-semibold">Location</th>
                                    <th className="p-4 uppercase font-semibold">Selected Retailer</th>
                                    <th className="p-4 uppercase font-semibold">Client Notes / Message</th>
                                    <th className="p-4 uppercase font-semibold">Timestamp</th>
                                    <th className="p-4 uppercase font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredLeads.map((lead) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4 font-bold text-white">
                                                {lead.firstName} {lead.lastName}
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white/80">{lead.email}</div>
                                                <div className="text-white/40 mt-0.5">{lead.phone}</div>
                                            </td>
                                            <td className="p-4 text-white/80 uppercase">{lead.country}</td>
                                            <td className="p-4 text-mclaren-orange font-semibold uppercase">{lead.retailer}</td>
                                            <td className="p-4 max-w-xs truncate text-white/60" title={lead.message}>
                                                {lead.message || "N/A"}
                                            </td>
                                            <td className="p-4 text-white/40 text-[10px]">
                                                {new Date(lead.createdAt).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handlePurge(lead.id)}
                                                    className="px-2.5 py-1 border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-white text-[9px] font-bold tracking-widest rounded transition-all uppercase cursor-pointer"
                                                >
                                                    PURGE
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
