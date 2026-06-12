export interface BookingDetails {
    clientName: string;
    phone: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: Date;
    distance?: string;
    price?: string;
}

export function generateGoogleCalendarLink(booking: BookingDetails): string {
    // 1. Format dates (Google expects YYYYMMDDTHHMMSSZ, usually UTC)
    // We'll use local time approximation for simplicity or proper ISO conversion
    const start = booking.pickupTime.toISOString().replace(/-|:|\.\d\d\d/g, "");

    // Estimate 1 hour duration by default
    const endTime = new Date(booking.pickupTime.getTime() + 60 * 60 * 1000);
    const end = endTime.toISOString().replace(/-|:|\.\d\d\d/g, "");

    // 2. Build Title & Description
    const title = encodeURIComponent(`🚖 Course: ${booking.clientName}`);

    let descriptionText = `📞 Tel: ${booking.phone}\n📍 De: ${booking.pickupLocation}\n🏁 Vers: ${booking.dropoffLocation}`;
    if (booking.price) descriptionText += `\n💰 Prix estimé: ${booking.price}`;
    if (booking.distance) descriptionText += `\n📏 Distance: ${booking.distance}`;
    descriptionText += `\n\n(Généré par TaxiCMS)`;

    const details = encodeURIComponent(descriptionText);
    const location = encodeURIComponent(booking.pickupLocation);

    // 3. Construct Magic URL
    // sf=true ensures it tries to load in a friendly mode
    // output=xml is sometimes used but action=TEMPLATE is key
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}
