"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroCarouselProps {
    images: string[];
    alt: string;
}

export function HeroCarousel({ images, alt }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter out duplicates and invalid images
    const uniqueImages = Array.from(new Set(images.filter(img => !!img)));

    // Fallback images if not enough provided
    const fallbacks = [
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop", // Mercedes Tunnel
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop", // Road Trip
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop"  // Luxury Steering Wheel
    ];

    const finalImages = uniqueImages.length > 0 ? uniqueImages : fallbacks;

    // Add some fallbacks if we only have 1 image to create movement
    if (finalImages.length === 1) {
        finalImages.push(...fallbacks.slice(0, 2));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % finalImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [finalImages.length]);

    return (
        <div className="absolute inset-0 z-0">
            {finalImages.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`${alt} - Vue ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0} // Only priority load the first one
                        sizes="100vw"
                    />
                </div>
            ))}
            {/* Gradient Overlay applied on top of all images */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent z-10" />

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 z-10" />
        </div>
    );
}
