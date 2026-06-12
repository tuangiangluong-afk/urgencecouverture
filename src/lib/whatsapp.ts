import { BookingDetails, generateGoogleCalendarLink } from "./calendar";

const META_API_VERSION = "v18.0";
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const DRIVER_PHONE_NUMBER = process.env.DRIVER_PHONE_NUMBER; // The driver receiving leads

export async function sendLeadToDriver(booking: BookingDetails) {
    if (!META_PHONE_NUMBER_ID || !META_ACCESS_TOKEN || !DRIVER_PHONE_NUMBER) {
        console.warn("⚠️ Meta WhatsApp API keys missing.");
        return { success: false, error: "Missing config" };
    }

    const calendarUrl = generateGoogleCalendarLink(booking);

    // Format date for display (e.g. "Lundi 12 Janvier à 14:30")
    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Paris"
    }).format(booking.pickupTime);

    // Message Body
    // Note: Free form messages allowed if user initiated, but for business initiated 
    // we technically need a template. However, for "Service" category or during dev/testing
    // or if the driver writes first, free form works. 
    // To be strictly compliant with "Business Initiated", we should use a Template.
    // Here we assume "Utility" conversation or Template "new_lead" exists.
    // For simplicity in MVP, we try creating a session or use free text if permitted.

    // Using standard Text Message (requires active 24h window or template)
    // We will simulate a robust formatted text.
    const messageBody = `🚖 *NOUVEAU LEAD !*
------------------
👤 *${booking.clientName}*
📞 ${booking.phone}

📍 *De :* ${booking.pickupLocation}
🏁 *Vers :* ${booking.dropoffLocation}
🕒 *Date :* ${formattedDate}
💰 *Prix Est. :* ${booking.price || "Sur devis"}

👇 *ACTIONS :*
📅 *Ajouter au Planning :*
${calendarUrl}
`;

    const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_NUMBER_ID}/messages`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${META_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: DRIVER_PHONE_NUMBER,
                type: "text",
                text: { preview_url: false, body: messageBody }
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Meta API Entor:", data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Send WhatsApp Error:", error);
        return { success: false, error };
    }
}
