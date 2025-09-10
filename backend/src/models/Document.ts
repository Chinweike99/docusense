import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateDocumentData {
  title: string;
  content: string;
  embedding?: number[]; // ✅ embeddings should always be arrays
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    console.warn(`Retrying after error: ${err}. Attempts left: ${retries}`);
    await new Promise(res => setTimeout(res, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

export const DocumentModel = {
  async create(data: CreateDocumentData) {
    return withRetry(async () => {
      if (data.embedding) {
        return prisma.$queryRaw`
          INSERT INTO "Document" (id, title, content, embedding, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${data.title}, ${data.content}, ${`[${data.embedding.join(',')}]`}::vector, NOW(), NOW())
          RETURNING *
        `;
      } else {
        return prisma.document.create({
          data: {
            title: data.title,
            content: data.content, // ✅ fixed bug here
          },
        });
      }
    });
  },

  async findAll() {
    return withRetry(() =>
      prisma.document.findMany({
        orderBy: { createdAt: 'desc' },
      })
    );
  },

  async findById(id: string) {
    return withRetry(() =>
      prisma.document.findUnique({
        where: { id },
      })
    );
  },

  async update(id: string, data: Partial<CreateDocumentData>) {
    return withRetry(() =>
      prisma.document.update({
        where: { id },
        data,
      })
    );
  },

  async delete(id: string) {
    return withRetry(() =>
      prisma.document.delete({
        where: { id },
      })
    );
  },

  async findSimilar(embedding: number[], limit: number = 5) {
    return withRetry(() =>
      prisma.$queryRaw`
        SELECT id, title, content,
        1 - (embedding <=> ${`[${embedding.join(',')}]`}::vector) as similarity
        FROM "Document"
        WHERE embedding IS NOT NULL
        ORDER BY similarity DESC
        LIMIT ${limit}
      `
    );
  },
};
