"use client";

import { useState } from "react";
import CallModal from "./CallModal";
import { Theme } from "@/lib/theme";

interface CallButtonProps {
    phoneNumber: string;
    cityName: string;
    theme: Theme;
    className?: string;
    children: React.ReactNode;
}

export default function CallButton({
    phoneNumber,
    cityName,
    theme,
    className,
    children,
}: CallButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={className}
            >
                {children}
            </button>

            <CallModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                phoneNumber={phoneNumber}
                cityName={cityName}
                theme={theme}
            />
        </>
    );
}
