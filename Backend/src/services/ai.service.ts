// Mocked ai.service port to prevent compilation errors.
// Functionality relies on gemini.service.ts.
export async function generateTypeWaste(base64ImageFile: string): Promise<string> {
    return "unknown";
}
