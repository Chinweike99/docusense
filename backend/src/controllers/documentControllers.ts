import { Request, Response } from "express";
import { ollamaService } from "../services/ollama-service";
import { prisma } from "../utils/database";
import { Document } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2"; 

export const documentController = {
    async createDocument(req: Request, res: Response) {
        try {
            const id = createId();
            const {title, content} = req.body;
            if(!title || !content){
                return res.status(400).json({
                    error: "Title and content are required"
                })
            }

            const embedding = await ollamaService.generateEmbedding(content);
            console.log("Generated embedding:", embedding);
            if (!embedding) {
  return res.status(500).json({ error: "Failed to generate embedding" });
}
            // const [document] = await prisma.$queryRaw<any[]>`
            // INSERT INTO "Document" (id, title, content, embedding) 
            // VALUES (${id}, ${title}, ${content}, ${embedding}::vector)
            // RETURNING *
            // `;
            const [document] = await prisma.$queryRaw<any[]>`
    INSERT INTO "Document" (id, title, content, embedding) 
    VALUES (${id}, ${title}, ${content}, ${embedding}::vector)
    RETURNING id, title, content, "createdAt", "updatedAt", embedding::text as embedding_text
`;
            res.status(201).json({document});
        } catch (error) {
            console.error("Error creating document:", error);
            res.status(500).json({
                error: "Internal server error"
            });
        }
    },


    async getDocuments(req: Request, res: Response){
        try {
            const document = await prisma.document.findMany({
                orderBy: {createdAt: 'desc'}
            });
            res.status(200).json({document});
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({ error: 'Failed to fetch documents' });
        }
    },


    async getDocumentById(req: Request, res: Response){
        try {
            const {id} = req.params;
            const document = await prisma.document.findUnique({
                where: {id}
            })
            if(!document){
                return res.status(404).json({error: "Document not found"});
            }
            res.status(200).json({document});
        } catch (error) {
            console.error('Error fetching document:', error);
            res.status(500).json({ error: 'Failed to fetch document' });
            }
    },

    async updateDocument(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Check if document exists
        const existingDocument = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const updateData: any = {
            title: title || existingDocument.title,
            content: content || existingDocument.content,
        };

        if (content && content !== existingDocument.content) {
            const newEmbedding = await ollamaService.generateEmbedding(content);
            updateData.embedding = newEmbedding;
        }

        const document = await prisma.document.update({
            where: { id },
            data: updateData,
        });

        res.json(document);
        } catch (error) {
            console.error('Error updating document:', error);
            res.status(500).json({ error: 'Failed to update document' });
        }
    },

    async deleteDocument(req: Request, res: Response){
        try {
            const {id} = req.params;
            const document = await prisma.document.findUnique({where: {id}})
            if(!document){
                res.status(404).json({error: "Document not found"})
            }
            await prisma.document.delete({where: {id}});
            res.status(204).json({succ: "Document deleted "})
            
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({ error: 'Failed to delete document' })
        }
    },

    // Search document by semantic simalrities

    async searchDocument(req: Request, res: Response) {
        try {
            const {query} = req.body;
            if(!query){
                return res.status(400).json({ error: 'Query is required' });
            };

            const queryEmbedding = await ollamaService.generateEmbedding(query);
            const documents = await prisma.$queryRaw`
                SELECT id, title, content, 
                    embedding <-> ${queryEmbedding} as similarity
                FROM "Document"
                ORDER BY similarity ASC
                LIMIT 5
            `;

             res.json(documents);
        } catch (error) {
            console.error('Error searching documents:', error);
            res.status(500).json({ error: 'Failed to search documents' });
        }
    }


}

// function cuid(): any {
//     throw new Error("Function not implemented.");
// }
