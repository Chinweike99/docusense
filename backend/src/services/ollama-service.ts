import axios from "axios";
import { config } from "../utils/config";



class OllamaService {
    private baseURL: string;

    constructor(){
        this.baseURL = config.OLLAMA_BASE_URL;
    }

    async generateResponse(prompt: string): Promise<string>{
        try {
            const response = await axios.post(`${this.baseURL}/api/generate`, {
                model: config.OLLAMA_MODEL,
                prompt,
                stream: false
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
            console.log("This is the generated RESPONSE: ", response);
            // return response.data
            console.log("This is the generated EMBEDDING: ", response.data.embedding);
            return response.data.embedding
        } catch (error) {
            console.log(error);
            throw Error("Unabale to generate embeddings: ")
        }
    }
}

export const ollamaService = new OllamaService();