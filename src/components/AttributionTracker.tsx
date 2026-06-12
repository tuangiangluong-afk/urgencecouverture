"use client";

import { useEffect } from "react";

// Cookie helper functions
function setCookie(name: string, value: string, days: number) {
    if (typeof document === "undefined") return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
}

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

export default function AttributionTracker() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Check if attribution is already stored in cookie or session storage
        const existingAttribution = getCookie("lead_attribution") || sessionStorage.getItem("lead_attribution");
        if (existingAttribution) return;

        const urlParams = new URLSearchParams(window.location.search);
        const referrer = document.referrer;
        
        let source = "direct";
        let medium = "direct";
        let campaign = "";
        let term = "";
        let content = "";

        // 1. Check for UTM parameters (explicit campaign links)
        if (urlParams.has("utm_source")) {
            source = urlParams.get("utm_source") || "direct";
            medium = urlParams.get("utm_medium") || "cpc";
            campaign = urlParams.get("utm_campaign") || "";
            term = urlParams.get("utm_term") || "";
            content = urlParams.get("utm_content") || "";
        } 
        // 2. Check for Google Ads (gclid, gbraid, wbraid)
        else if (urlParams.has("gclid") || urlParams.has("gbraid") || urlParams.has("wbraid")) {
            source = "google";
            medium = "cpc";
            campaign = urlParams.get("utm_campaign") || "google_ads";
            term = urlParams.get("utm_term") || "";
        } 
        // 3. Check for Facebook Ads (fbclid)
        else if (urlParams.has("fbclid")) {
            source = "facebook";
            medium = "cpc";
            campaign = urlParams.get("utm_campaign") || "facebook_ads";
        } 
        // 4. Fallback to referrer analysis (Organic SEO, Social, Referral)
        else if (referrer) {
            try {
                const refUrl = new URL(referrer);
                const host = refUrl.hostname.toLowerCase();

                // Check if search engine (Organic SEO)
                if (
                    host.includes("google.") || 
                    host.includes("bing.com") || 
                    host.includes("yahoo.com") || 
                    host.includes("duckduckgo.com") || 
                    host.includes("qwant.com")
                ) {
                    source = host.includes("google") ? "google" : (host.split(".")[1] || host);
                    medium = "organic";
                } 
                // Check if major social network
                else if (
                    host.includes("facebook.com") || 
                    host.includes("instagram.com") || 
                    host.includes("t.co") || // Twitter/X
                    host.includes("linkedin.com") || 
                    host.includes("pinterest.com")
                ) {
                    source = host.includes("t.co") ? "twitter" : (host.split(".")[1] || host);
                    medium = "social";
                } 
                // Any other referring site
                else {
                    source = host;
                    medium = "referral";
                }
            } catch (e) {
                console.error("Failed to parse referrer URL:", e);
            }
        }

        const attributionData = {
            source,
            medium,
            campaign,
            term,
            content,
            landing_page: window.location.pathname,
            referrer: referrer || "direct",
            timestamp: new Date().toISOString()
        };

        const attributionStr = JSON.stringify(attributionData);
        
        // Save to 30-day cookie for cross-session persistence
        setCookie("lead_attribution", attributionStr, 30);
        // Save to sessionStorage for quick session-level reference
        sessionStorage.setItem("lead_attribution", attributionStr);
    }, []);

    return null;
}
