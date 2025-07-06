// src/lib/translateApi.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Get this from your .env
const MODEL_NAME = "models/gemini-1.5-flash"; // Or "gemini-1.5-flash", "gemini-1.5-pro", etc. Choose based on your needs and cost.

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function translateText(text, targetLanguage, sourceLanguage = 'auto') {
    if (!text) return "";

    if (!GEMINI_API_KEY) {
        console.error("Gemini API Key is missing! Translation will not work.");
        return text;
    }

    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Construct the prompt for translation
        const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n"${text}"`;

        const result = await model.generateContent(prompt);
        const response =  result.response;
        const translatedText = response.text();

        return translatedText;

    } catch (error) {
        console.error("Error calling Gemini API for translation:", error);
        // Fallback: Return original text if translation fails
        return text;
    }
}