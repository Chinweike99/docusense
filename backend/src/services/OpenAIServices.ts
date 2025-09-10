import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const OpenAIService = {
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await openai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: text,
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw new Error('Failed to generate embedding')
        }
    },

    async generateCompletion(prompt: string, context: string): Promise<string>{
        try {
            const systemMessage = `You are a helpful assistant. Use the following context to answer the user's question. If you don't know the answer based on the context, say so instead of making up an answer.
            context: ${context}
            User Question: ${prompt}
            `;
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {role: 'system', content: systemMessage},
                    {role: 'user', content: prompt}
                ],
                max_tokens: 500,
                temperature: 0.7
            });
            console.log(response)
            return response.choices[0].message?.content || 'Sorry, i could not generate a response';

        } catch (error) {
            console.log(error);
            throw new Error("Failed to generate completion");
        }
    }    
}


