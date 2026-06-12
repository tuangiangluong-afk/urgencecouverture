import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2025-01-27-acacia" as any,
      })
    : null as unknown as Stripe; // Build will pass, but will fail at runtime if not defined
