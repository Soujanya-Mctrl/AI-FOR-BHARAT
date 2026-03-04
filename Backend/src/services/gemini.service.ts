import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';

// Assume config.geminiApiKey exists or just use process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const classifyWasteImage = async (imageUrl: string): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Cloudinary images can be downloaded to base64, or perhaps Gemini takes URL?
        // Gemini vision requires inlineData in base64. So we need to fetch the image, convert to base64.

        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        // We would determine the MIME type from imageUrl or the fetch response headers.
        const mimeType = response.headers.get("content-type") || "image/jpeg";

        const prompt = `Analyze this image of waste.
    What specific types of materials are visible?
    Based on the materials, classify this waste into one of the following categories: Organic, Plastic, Paper, Glass, Metal, E-waste, Medical, Hazardous, or Other.
    Format your response with a concise single-line classification stating ONLY the category name.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ]);

        const responseText = result.response.text();
        return responseText.trim();
    } catch (error) {
        console.error("Gemini classification error:", error);
        return 'unclassified';
    }
};
