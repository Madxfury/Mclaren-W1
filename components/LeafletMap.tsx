"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix generic Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
    center: { lat: number; lng: number };
    zoom: number;
    showrooms: any[];
    selectedShowroom: number | null;
    onShowroomClick: (showroom: any) => void;
}

function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
    }, [center, zoom, map]);
    return null;
}

const customIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: #FF8000;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px rgba(255, 128, 0, 0.6);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});

export default function LeafletMap({ center, zoom, showrooms, selectedShowroom, onShowroomClick }: LeafletMapProps) {
    return (
        <MapContainer
            center={[25, 0]}
            zoom={3}
            className="w-full h-full outline-none bg-[#111]"
            zoomControl={false}
            scrollWheelZoom={true}
            minZoom={2}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapController center={center} zoom={zoom} />

            {showrooms.map((showroom) => (
                <Marker
                    key={showroom.id}
                    position={[showroom.lat, showroom.lng]}
                    icon={customIcon}
                    eventHandlers={{
                        click: () => onShowroomClick(showroom),
                    }}
                >
                    <Popup
                        className="custom-popup-premium"
                        closeButton={false}
                    >
                        <div className="p-2 min-w-[150px]">
                            <p className="text-[#FF8000] text-xs font-bold tracking-widest uppercase mb-1">SELECTED</p>
                            <h3 className="text-black text-lg font-extrabold font-orbitron uppercase leading-none">{showroom.city}</h3>
                            <p className="text-black/60 text-xs font-rajdhani font-semibold mt-1">{showroom.name}</p>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(showroom.address)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold border-b border-black hover:text-[#FF8000] hover:border-[#FF8000] transition-colors pb-0.5">
                                GET DIRECTIONS &rarr;
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
