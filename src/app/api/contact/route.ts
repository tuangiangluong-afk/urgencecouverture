import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Safe fallback to avoid crash if env missing

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message, domain, city, postalCode } = body;

        // Validation simple
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }

        // Send Email via Resend
        // If API Key is not set, we just log it (Simulated Mode)
        if (!process.env.RESEND_API_KEY) {
            console.log("⚠️ SIMULATION RESEND (No API Key found)");
            console.log("To: hello@urgencecouverture.com");
            console.log(`Subject: [${postalCode || city}] Nouveau message de ${name}`);
            console.log("Body:", message);

            // Simulate delay
            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json({ success: true, simulated: true });
        }

        const data = await resend.emails.send({
            from: 'Urgence Couverture <contact@urgencecouverture.com>',
            to: ['hello@urgencecouverture.com'],
            replyTo: email,
            subject: `[${postalCode || city}] Contact: ${subject} - ${name}`,
            html: `
                <h1>Nouveau message depuis ${domain}</h1>
                <p><strong>Ville :</strong> ${city}</p>
                <p><strong>Code Postal :</strong> ${postalCode || 'N/A'}</p>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Téléphone :</strong> ${phone || 'N/A'}</p>
                <p><strong>Sujet :</strong> ${subject}</p>
                <hr />
                <h3>Message :</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        if (data.error) {
            console.error("Resend API Error:", data.error);
            return NextResponse.json({ error: data.error.message || "Erreur d'envoi Resend" }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
