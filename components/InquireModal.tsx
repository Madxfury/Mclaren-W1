"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { countries } from "@/data/countries";

// Dynamically import the Map component to avoid SSR issues
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#111] text-white/30 font-orbitron text-sm tracking-widest animate-pulse">
            INITIALIZING SATELLITE FEED...
        </div>
    ),
});

import { retailers } from "@/data/retailers";

interface InquireModalProps {
    onClose: () => void;
}

export default function InquireModal({ onClose }: InquireModalProps) {
    const [selectedShowroom, setSelectedShowroom] = useState<number | null>(null);
    const [center, setCenter] = useState({ lat: 20.0, lng: 0.0 });
    const [zoom, setZoom] = useState(2);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        phoneCode: "",
        phoneNumber: "",
        message: "",
        marketingPreferences: {
            email: false,
            phone: false,
            mail: false,
            sms: false
        },
        privacyAgreed: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleShowroomClick = (showroom: typeof retailers[0]) => {
        setSelectedShowroom(showroom.id);
        setCenter({ lat: showroom.lat, lng: showroom.lng });
        setZoom(14);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'marketing' | 'privacy', method?: string) => {
        if (type === 'privacy') {
            setFormData(prev => ({ ...prev, privacyAgreed: e.target.checked }));
        } else if (type === 'marketing' && method) {
            setFormData(prev => ({
                ...prev,
                marketingPreferences: {
                    ...prev.marketingPreferences,
                    [method.toLowerCase()]: e.target.checked
                }
            }));
        }
    };

    const handleSubmit = async () => {
        // Validation: Verify all required fields including Phone
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.country || !formData.phoneCode || !formData.phoneNumber || !formData.privacyAgreed) {
            alert("Please fill in all required fields (*) and accept the privacy policy.");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const showroom = retailers.find(r => r.id === selectedShowroom);
            const retailerName = showroom ? `${showroom.name} (${showroom.city})` : 'Unknown';

            const response = await fetch("/api/inquire", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneCode: formData.phoneCode,
                    phoneNumber: formData.phoneNumber,
                    country: formData.country,
                    retailer: retailerName,
                    message: formData.message,
                    marketingPreferences: formData.marketingPreferences
                })
            });

            const result = await response.json();

            if (!result.success) throw new Error(result.message || 'Failed to submit');

            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
                // Reset form slightly later to ensure clean exit
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setShowEnquiryForm(false);
                    setFormData({
                        firstName: "",
                        lastName: "",
                        country: "",
                        email: "",
                        phoneCode: "",
                        phoneNumber: "",
                        message: "",
                        marketingPreferences: { email: false, phone: false, mail: false, sms: false },
                        privacyAgreed: false
                    });
                }, 500);
            }, 2000);

        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredRetailers = retailers.filter((showroom) => {
        const query = searchQuery.toLowerCase();
        return (
            showroom.city.toLowerCase().includes(query) ||
            showroom.name.toLowerCase().includes(query) ||
            showroom.address.toLowerCase().includes(query)
        );
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Custom Bezier for premium feel
            className="fixed inset-0 z-[100] bg-mclaren-black/95 backdrop-blur-sm flex flex-col lg:flex-row overflow-hidden"
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[1000] group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-mclaren-orange hover:border-mclaren-orange transition-all duration-300"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white group-hover:rotate-90 transition-transform duration-300">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            {/* Left Panel: List & Search OR Details */}
            <div className="w-full lg:w-1/3 flex flex-col border-r border-white/10 relative z-20 bg-mclaren-black h-full shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                {!selectedShowroom ? (
                    // VIEW 1: LIST & SEARCH
                    <div className="flex flex-col h-full p-8 lg:p-12">
                        <div className="mb-10">
                            <h2 className="text-4xl font-orbitron font-light tracking-wide uppercase text-white mb-2">
                                Find A <span className="text-mclaren-orange">Retailer</span>
                            </h2>
                            <p className="text-white/40 text-sm font-rajdhani tracking-wider">LOCATE YOUR NEAREST SHOWROOM</p>
                        </div>

                        <div className="relative mb-8 group">
                            <input
                                type="text"
                                placeholder="Search by City or Country"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-mclaren-orange transition-all duration-300 placeholder:text-white/30 font-rajdhani text-white"
                            />
                            <svg className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2"
                            data-lenis-prevent
                        >
                            {filteredRetailers.map((showroom) => (
                                <div
                                    key={showroom.id}
                                    onClick={() => handleShowroomClick(showroom)}
                                    className={`p-5 border-l-2 cursor-pointer transition-all duration-300 group ${selectedShowroom === showroom.id
                                        ? "bg-white/5 border-mclaren-orange"
                                        : "border-transparent hover:bg-white/5 hover:border-white/30"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-orbitron font-medium text-white group-hover:text-mclaren-orange transition-colors">{showroom.city}</h3>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{showroom.name}</p>
                                        </div>
                                    </div>
                                    <p className="text-white/40 font-rajdhani text-sm leading-relaxed">{showroom.address}</p>
                                </div>
                            ))}
                            {filteredRetailers.length === 0 && (
                                <div className="text-white/30 font-rajdhani italic text-center mt-10">
                                    No retailers found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // VIEW 2: DETAILS VIEW
                    (() => {
                        const showroom = retailers.find(r => r.id === selectedShowroom);
                        if (!showroom) return null;

                        return (
                            <div className="flex flex-col h-full p-8 lg:p-12 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                                {/* Back Button */}
                                <button
                                    onClick={() => {
                                        setSelectedShowroom(null);
                                        setZoom(2);
                                        setCenter({ lat: 20, lng: 0 });
                                    }}
                                    className="flex items-center text-white/50 hover:text-white transition-colors mb-8 text-xs tracking-widest uppercase font-bold"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Back to Retailer Locator
                                </button>

                                {/* Title */}
                                <h1 className="text-4xl font-orbitron font-light uppercase text-white mb-6 leading-none">
                                    {showroom.city}
                                </h1>

                                {/* Tabs (Visual Only for now) */}
                                <div className="flex space-x-8 mb-8 border-b border-white/10 pb-4">
                                    <button className="text-mclaren-orange text-xs font-bold tracking-widest uppercase border-b-2 border-mclaren-orange pb-4 -mb-4.5">Sales</button>
                                </div>

                                {/* Address */}
                                <div className="mb-8">
                                    <h3 className="text-white/40 text-xs font-rajdhani mb-2">Address information</h3>
                                    <p className="text-white font-rajdhani text-lg leading-relaxed">{showroom.address}</p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(showroom.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block px-6 py-3 border border-white/20 text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                                    >
                                        Get Directions
                                    </a>
                                </div>

                                {/* Contact */}
                                <div className="mb-8">
                                    <h3 className="text-white/40 text-xs font-rajdhani mb-2">Call our team</h3>
                                    <p className="text-white font-rajdhani text-xl tracking-wider">{showroom.phone}</p>
                                </div>

                                {/* Hours */}
                                <div className="mb-10">
                                    <h3 className="text-white/40 text-xs font-rajdhani mb-4">Opening Hours</h3>
                                    <div className="space-y-2">
                                        {Object.entries(showroom.openingHours).map(([day, hours]) => (
                                            <div key={day} className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-white/70 font-rajdhani text-sm">{day}</span>
                                                <span className="text-white font-rajdhani text-sm font-medium">{hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-auto grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowEnquiryForm(true)}
                                        className="w-full text-center py-4 bg-mclaren-orange hover:bg-orange-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
                                    >
                                        Start Enquiry
                                    </button>
                                    <a
                                        href={showroom.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-full py-4 border border-white/20 hover:bg-white hover:text-black text-white text-xs font-bold tracking-widest uppercase transition-colors"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        );
                    })()
                )}
            </div>

            {/* Right Panel: Leaflet Map OR Enquiry Form Layer */}
            <div className="w-full lg:w-2/3 h-full bg-[#0a0a0a] relative z-10">
                {showEnquiryForm && selectedShowroom ? (
                    <div
                        className="absolute inset-0 z-50 bg-[#111] overflow-y-auto custom-scrollbar flex flex-col items-center overscroll-contain"
                        data-lenis-prevent
                    >
                        <div className="w-full max-w-2xl py-12 px-6 lg:px-0">
                            {/* Form Header */}
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-orbitron text-white">ENQUIRY</h2>
                                <button
                                    onClick={() => setShowEnquiryForm(false)}
                                    className="text-white/50 hover:text-mclaren-orange text-sm font-rajdhani tracking-wider transition-colors"
                                >
                                    CANCEL
                                </button>
                            </div>

                            {submitStatus === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
                                    >
                                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <h3 className="text-2xl font-orbitron text-white">Enquiry Submitted</h3>
                                    <p className="text-white/60 font-rajdhani">Thank you. Our team will contact you shortly.</p>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {/* Section 1: About You */}
                                    <section>
                                        <h3 className="text-white/40 text-sm font-rajdhani uppercase tracking-widest mb-6">About you</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="group">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="First Name *"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors placeholder:text-white/20"
                                                />
                                            </div>
                                            <div className="group">
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name *"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors placeholder:text-white/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors [&>option]:bg-black"
                                            >
                                                <option value="" disabled>Country of Residence *</option>
                                                {countries.map((country) => (
                                                    <option key={country.code} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </section>

                                    {/* Section 2: Contact Details */}
                                    <section>
                                        <h3 className="text-white/40 text-sm font-rajdhani uppercase tracking-widest mb-6">Your contact details</h3>
                                        <div className="mb-6">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address *"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors placeholder:text-white/20"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="group">
                                                <select
                                                    name="phoneCode"
                                                    value={formData.phoneCode}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors [&>option]:bg-black"
                                                >
                                                    <option value="" disabled>Code *</option>
                                                    {countries.map((country) => (
                                                        <option key={`${country.code}-dial`} value={country.dial_code}>
                                                            {country.code} ({country.dial_code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="group md:col-span-2">
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    placeholder="Phone Number *"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors placeholder:text-white/20"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 3: Retailer Preferences */}
                                    <section>
                                        <h3 className="text-white/40 text-sm font-rajdhani uppercase tracking-widest mb-6">Your retailer preferences</h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="group">
                                                <input
                                                    type="text"
                                                    value={retailers.find(r => r.id === selectedShowroom)?.city || ''}
                                                    readOnly
                                                    className="w-full bg-transparent border-b border-white/20 py-3 text-mclaren-orange font-rajdhani focus:outline-none cursor-not-allowed opacity-80"
                                                />
                                                <p className="text-white/20 text-xs mt-1">Selected Retailer for Your Enquriy</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 4: Message */}
                                    <section>
                                        <h3 className="text-white/40 text-sm font-rajdhani uppercase tracking-widest mb-6">Message</h3>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Is there anything else you would like us to know?"
                                            className="w-full bg-transparent border-b border-white/20 py-3 text-white font-rajdhani focus:outline-none focus:border-mclaren-orange transition-colors placeholder:text-white/20 resize-none"
                                        ></textarea>
                                    </section>

                                    {/* Section 5: Marketing & Submit */}
                                    <section>
                                        <h3 className="text-white/40 text-sm font-rajdhani uppercase tracking-widest mb-6">Marketing preferences</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {['Email', 'Phone', 'Mail', 'SMS'].map((method) => (
                                                <label key={method} className="flex items-center space-x-3 cursor-pointer group">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.marketingPreferences[method.toLowerCase() as keyof typeof formData.marketingPreferences]}
                                                            onChange={(e) => handleCheckboxChange(e, 'marketing', method)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-5 h-5 border border-white/30 peer-checked:bg-mclaren-orange peer-checked:border-mclaren-orange transition-all"></div>
                                                        <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                    <span className="text-white/60 font-rajdhani text-sm group-hover:text-white transition-colors">{method}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <label className="flex items-start space-x-3 mb-10 cursor-pointer group">
                                            <div className="relative mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.privacyAgreed}
                                                    onChange={(e) => handleCheckboxChange(e, 'privacy')}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 border border-white/30 peer-checked:bg-mclaren-orange peer-checked:border-mclaren-orange transition-all"></div>
                                                <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <p className="text-white/40 text-xs font-rajdhani leading-relaxed group-hover:text-white/60 transition-colors">
                                                I agree to McLaren's Privacy Policy. McLaren agrees to respect your privacy, and your personal data will be processed in accordance with our Privacy Policy. *
                                            </p>
                                        </label>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className={`w-full py-4 bg-mclaren-orange hover:bg-orange-600 text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                                        </button>

                                        {submitStatus === 'error' && (
                                            <p className="text-red-500 text-sm font-rajdhani text-center mt-4">
                                                There was an error submitting your enquiry. Please try again.
                                            </p>
                                        )}
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <LeafletMap
                        center={center}
                        zoom={zoom}
                        showrooms={retailers}
                        selectedShowroom={selectedShowroom}
                        onShowroomClick={handleShowroomClick}
                    />
                )
                }
            </div >

            {/* CSS overlay for popup styling overrides (since we can't easily import css modules here) */}
            < style jsx global > {`
        .leaflet-popup-content-wrapper {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 0px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border-left: 3px solid #FF8000;
        }
        .leaflet-popup-tip {
            background: rgba(255, 255, 255, 0.95);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #FF8000;
        }

        /* Force dark background for autofill */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #111 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style >
        </motion.div >
    );
}
