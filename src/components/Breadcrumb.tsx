import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
    return (
        <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Fil d'Ariane">
            <Link href="/" className="text-neutral-400 hover:text-white transition flex items-center gap-1">
                <Home size={14} />
                <span className="sr-only">Accueil</span>
            </Link>
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-neutral-600" />
                    {item.href ? (
                        <Link href={item.href} className="text-neutral-400 hover:text-white transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-white font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
