import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export interface CreateDocumentData {
    title: string;
    content: string;
    embedding?: number | number[];
}


export const DocumentModel = {
    async create(data: CreateDocumentData){
        
            if(data.embedding){
                return prisma.$queryRaw`INSERT INTO "Document" (id, title, content, embedding, "createdAt", "updatedAt")
                VALUES (gen_random_uuid(), ${data.title}, ${data.content}, ${data.embedding}::vector, NOW(), NOW())
                RETURNING *
                `
            }else {
                return prisma.document.create({
                    data: {
                    title: data.title,
                    content: data.title,
            }
                })
            }
    },

    async findAll() {
        return prisma.document.findMany({
            orderBy: {createdAt: 'desc'},
        })
    },

    async findById(id: string) {
        return prisma.document.findUnique({
            where: {id},
        })
    },

    async update(id: string, data: Partial<CreateDocumentData>){
        return prisma.document.update({
            where: {id},
            data
        })
    },

    async delete(id: string){
        return prisma.document.delete({
            where: {id}
        })
    },

    async findSimilar(embedding: number[], limit: number = 5){
        // Using Prisma's raw query for vector similarity search.
        return prisma.$queryRaw`
        SELECT id, title, content,
        1 - (embedding <=> ${`[${embedding.join(',')}]`}::vector) as similarity
        FROM "Document"
        WHERE embedding IS NOT NULL
        ORDER BY similarity DESC
        LIMIT ${limit}
        `;
    }

}





