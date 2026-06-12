"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, or I will use clsx/tailwind-merge directly if not

interface TableOfContentsProps {
    content: string;
}

interface HeadaingItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<HeadaingItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse h2 and h3 from DOM
        const elements = Array.from(document.querySelectorAll('h2, h3'));
        
        const items: HeadaingItem[] = elements.map((elem) => ({
            id: elem.id,
            text: elem.textContent || "",
            level: Number(elem.tagName.substring(1)),
        })).filter(item => item.id && item.text);

        setHeadings(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24 hidden lg:block bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h4 className="flex items-center gap-2 font-bold text-neutral-900 mb-4 text-lg">
                <List className="w-5 h-5 text-blue-600" />
                Sommaire
            </h4>
            <ul className="space-y-3 relative border-l-2 border-neutral-200 ml-2">
                {headings.map((heading) => (
                    <li key={heading.id} className="pl-4 relative">
                        {/* Active Indicator Line */}
                        <div 
                            className={cn(
                                "absolute -left-[2px] top-0 bottom-0 w-[2px] transition-colors duration-300",
                                activeId === heading.id ? "bg-blue-600" : "bg-transparent"
                            )} 
                        />
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: "smooth",
                                });
                                setActiveId(heading.id);
                            }}
                            className={cn(
                                "block text-sm transition-colors duration-200 line-clamp-2",
                                activeId === heading.id
                                    ? "font-bold text-blue-600" 
                                    : "text-neutral-500 hover:text-neutral-900",
                                heading.level === 3 && "pl-4 text-xs"
                            )}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
