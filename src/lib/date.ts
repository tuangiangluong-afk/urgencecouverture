export function getCurrentYearSEO(): string {
    const date = new Date();
    // SEO Hack: From October (Month 9), we start ranking for the next year
    // Example: In Oct 2025, we want to rank for "Borne Recharge 2026"
    if (date.getMonth() >= 9) { // 9 = October
        return (date.getFullYear() + 1).toString();
    }
    return date.getFullYear().toString();
}
