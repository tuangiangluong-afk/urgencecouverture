
"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
};

interface DepartmentMapProps {
    center: { lat: number; lng: number };
    zoom?: number;
}

export function DepartmentMap({ center, zoom = 11 }: DepartmentMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    });

    const options = useMemo(
        () => ({
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "all",
                    elementType: "geometry",
                    stylers: [{ color: "#242f3e" }],
                },
                {
                    featureType: "all",
                    elementType: "labels.text.stroke",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#746855" }],
                },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                },
            ],
        }),
        []
    );

    if (!isLoaded) {
        return (
            <div className="h-full w-full animate-pulse rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500">
                Chargement de la carte...
            </div>
        );
    }

    return (
        <div className="h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                options={options}
            >
                {/* We can add Markers later based on cities */}
                <Marker position={center} />
            </GoogleMap>
        </div>
    );
}
