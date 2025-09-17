import fs from 'fs';
import pdf from 'pdf-parse';

export async function extractTextFromPDf(filePath: string): Promise<string> {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer)
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF: ", error);
        throw new Error("Failed to extract text from PDF");
    }
}