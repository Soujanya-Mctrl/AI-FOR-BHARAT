import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Classify waste from a Cloudinary image URL
export const classifyWasteImage = async (imageUrl: string): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const mimeType = response.headers.get("content-type") || "image/jpeg";

        const result = await model.generateContent([
            CLASSIFICATION_PROMPT,
            { inlineData: { data: base64Image, mimeType } }
        ]);

        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini classification error:", error);
        return 'unclassified';
    }
};

// Classify waste from a raw base64 image buffer (used by WasteType controller)
export async function generateTypeWaste(base64ImageFile: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
            CLASSIFICATION_PROMPT,
            { inlineData: { data: base64ImageFile, mimeType: "image/jpeg" } }
        ]);

        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini classification error:", error);
        return 'unknown';
    }
}

const CLASSIFICATION_PROMPT = `Analyze this image of waste.
What specific types of materials are visible?
Based on the materials, classify this waste into one of the following categories: Organic, Plastic, Paper, Glass, Metal, E-waste, Medical, Hazardous, or Other.
Format your response with a concise single-line classification stating ONLY the category name.`;
