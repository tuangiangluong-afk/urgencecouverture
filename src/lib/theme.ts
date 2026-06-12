
// Deterministically assign a color theme based on the city slug
// We only use premium, high-contrast colors suitable for transport/logistics

export const THEMES = [
    {
        name: 'amber',
        primary: 'yellow',
        text: 'text-neutral-900',
        classes: {
            bg: 'bg-yellow-400',
            bgHover: 'hover:bg-yellow-300',
            text: 'text-yellow-400',
            border: 'border-yellow-400/30',
            shadow: 'shadow-yellow-400/20',
            gradientFrom: 'from-yellow-400',
            gradientTo: 'to-yellow-500'
        }
    },
    {
        name: 'emerald',
        primary: 'emerald',
        text: 'text-white',
        classes: {
            bg: 'bg-emerald-600',
            bgHover: 'hover:bg-emerald-500',
            text: 'text-emerald-400',
            border: 'border-emerald-400/30',
            shadow: 'shadow-emerald-400/20',
            gradientFrom: 'from-emerald-600',
            gradientTo: 'to-emerald-500'
        }
    },
    {
        name: 'blue',
        primary: 'blue',
        text: 'text-white',
        classes: {
            bg: 'bg-blue-900',
            bgHover: 'hover:bg-blue-950',
            text: 'text-blue-900',
            border: 'border-blue-900/30',
            shadow: 'shadow-blue-900/20',
            gradientFrom: 'from-blue-900',
            gradientTo: 'to-blue-950'
        }
    },
    {
        name: 'violet',
        primary: 'violet',
        text: 'text-white',
        classes: {
            bg: 'bg-violet-900',
            bgHover: 'hover:bg-violet-950',
            text: 'text-violet-900',
            border: 'border-violet-900/30',
            shadow: 'shadow-violet-900/20',
            gradientFrom: 'from-violet-900',
            gradientTo: 'to-violet-950'
        }
    },
    {
        name: 'rose',
        primary: 'rose',
        text: 'text-white',
        classes: {
            bg: 'bg-rose-900',
            bgHover: 'hover:bg-rose-950',
            text: 'text-rose-900',
            border: 'border-rose-900/30',
            shadow: 'shadow-rose-900/20',
            gradientFrom: 'from-rose-900',
            gradientTo: 'to-rose-950'
        }
    },
    {
        name: 'cyan',
        primary: 'cyan',
        text: 'text-neutral-900',
        classes: {
            bg: 'bg-cyan-600',
            bgHover: 'hover:bg-cyan-500',
            text: 'text-cyan-800',
            border: 'border-cyan-600/30',
            shadow: 'shadow-cyan-600/20',
            gradientFrom: 'from-cyan-600',
            gradientTo: 'to-cyan-700'
        }
    },
    {
        name: 'orange',
        primary: 'orange',
        text: 'text-neutral-900',
        classes: {
            bg: 'bg-orange-600',
            bgHover: 'hover:bg-orange-500',
            text: 'text-orange-800',
            border: 'border-orange-600/30',
            shadow: 'shadow-orange-600/20',
            gradientFrom: 'from-orange-600',
            gradientTo: 'to-orange-700'
        }
    },
    {
        name: 'indigo',
        primary: 'indigo',
        text: 'text-white',
        classes: {
            bg: 'bg-indigo-900',
            bgHover: 'hover:bg-indigo-950',
            text: 'text-indigo-900',
            border: 'border-indigo-900/30',
            shadow: 'shadow-indigo-900/20',
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950'
        }
    },
] as const;

export type Theme = typeof THEMES[number];



export function getTheme(slug: string) {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Positive modulo
    const index = Math.abs(hash) % THEMES.length;
    return THEMES[index];
}
