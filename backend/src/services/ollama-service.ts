import axios from "axios";
import { config } from "../utils/config";



class OllamaService {
    private baseURL: string;

    constructor(){
        this.baseURL = config.OLLAMA_BASE_URL;
    }

    async generateResponse(prompt: string, options: any = {}): Promise<string>{
        try {
            const response = await axios.post(`${this.baseURL}/api/generate`, {
                model: config.OLLAMA_MODEL,
                prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    ...options
                }
            });
            return response.data.response
        } catch (error) {
            console.log("Error generatin response from Ollama: ", error);
            throw new Error("Failed to geenrate response")
        }
    }; 


    async generateEmbedding(text: string): Promise<string>{
        try {
            const response = await axios.post(`${this.baseURL}/api/embeddings`, {
                model: config.EMBEDDING_MODEL,
                prompt: text
            })
            return response.data.embedding
        } catch (error) {
            console.log(error);
            throw Error("Unabale to generate embeddings: ")
        }
    }

    async generateSummary(text: string, length: string = 'mdeium'): Promise<string>{
        let lengthPrompt = '';
    switch (length) {
      case 'short':
        lengthPrompt = 'Provide a very brief summary (2-3 sentences)';
        break;
      case 'long':
        lengthPrompt = 'Provide a detailed summary (about a paragraph)';
        break;
      default:
        lengthPrompt = 'Provide a concise summary (about 5-6 sentences)';
    }

    const prompt = `${lengthPrompt} of the following text:\n\n${text.substring(0, 8000)}`;
    
    return this.generateResponse(prompt, {
      temperature: 0.3, // Lower temperature for more factual summaries
      top_p: 0.8
    });
    }
}

export const ollamaService = new OllamaService();