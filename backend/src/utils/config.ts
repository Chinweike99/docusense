import { Env } from '../types/env';

export const config: Env = {
  PORT: parseInt(process.env.PORT || '3001'),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/rag_chatbot',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2',
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'mxbai-embed-large',
};