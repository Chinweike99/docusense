// src/types/env.ts
export interface Env {
  PORT: number;
  DATABASE_URL: string;
  OLLAMA_BASE_URL: string;
  OLLAMA_MODEL: string;
  EMBEDDING_MODEL: string;
}