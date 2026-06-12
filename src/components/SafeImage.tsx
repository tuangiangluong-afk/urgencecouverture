"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends ImageProps {
    fallbackSrc?: string;
}

const SafeImage = ({ src, fallbackSrc = "/images/generated/modern-home.png", alt, ...props }: SafeImageProps) => {
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);
    }, [src]);

    return (
        <Image
            {...props}
            src={error ? fallbackSrc : src}
            alt={alt}
            onError={() => {
                if (!error) setError(true);
            }}
        />
    );
};

export default SafeImage;
