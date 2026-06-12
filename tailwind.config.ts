import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Custom Brand Blue (Matches Logo)
                blue: {
                    50: '#f0f5ff',
                    100: '#e0ebff',
                    200: '#c2d6ff',
                    300: '#94b5ff',
                    400: '#5c8aff',
                    500: '#2e5cff',
                    600: '#164194', // Main Brand Color (Darker Royal Blue)
                    700: '#103075',
                    800: '#0e275e',
                    900: '#11234a', // Logo Text Color match
                    950: '#0a152e',
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
};
export default config;
