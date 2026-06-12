import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";

if (!apiKey) {
    console.warn("Missing GOOGLE_API_KEY environment variable. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
