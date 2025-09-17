import { Request, Response } from "express";
import { ollamaService } from "../services/ollama-service";
import { prisma } from "../utils/database";
import { Document } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2"; 
import { extractTextFromPDf } from "../utils/pdfParser";
import fs from 'fs';
import path from 'path';
import { title } from "process";

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
            if (!embedding) {
  return res.status(500).json({ error: "Failed to generate embedding" });
}
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

    // Upload and process PDF document
    async uploadDocument(req: Request, res: Response){
        try {
            const id = createId();
            if(!req.file){
                return res.status(400).json({error: 'No file uploaded'})
            }
            const {originalname, filename, path: filePath, size} = req.file;
            const {title} = req.body;

            const content = await extractTextFromPDf(filePath);
            // Generate summary using Ollama
            const summary = await ollamaService.generateResponse(`Please provide a concise summary of the following document content:\n\n${content.substring(0, 8000)}`) // Limit content to avoid token limits

            // Generate Embedding
            const embedding = await ollamaService.generateEmbedding(content);

            const [document] = await prisma.$queryRaw<any[]>`
            INSERT INTO "Document" (id, title, content, "fileName", "filePath", "fileSize", embedding)
            VALUES (${id}, ${title}, ${summary}, ${originalname}, ${filePath}, ${size}, ${embedding}::vector)
            RETURNING id, title, content, "createdAt", "updatedAt", embedding::text as embedding_text
            `;

            res.status(201).json({
                ...document,
                fullcontent: content,
                filename: filename,
                summary: summary
            })

        } catch (error) {
            console.error("Error uploading document: ", error);
            if(req.file){
                fs.unlink(req.file.path, (err) => {
                    if(err) console.error("Error deleting file: ", err)
                });
            };
            res.status(500).json({
                error: 'Failed to upload and process document'
            })
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
    },

    // Generate summary for a document
    async generateDocumentSummary(req: Request, res: Response) {
        console.log("Received request to summarize document hit .....");
        try {
            const {id} = req.params;
            const { length } = req.body;
            const document = await prisma.document.findUnique({where: {id}});
            if(!document){
                return res.status(404).json({error: "Document not found"});
            }
            console.log("Document found: ", document);
            let content = document.content;
            if(document.fileName && fs.existsSync(document.filePath as string) ){
                content = await extractTextFromPDf(document.filePath as string);
            };
            // Determine summary length based on user preference
            let summaryLength = ''; 
            switch(length){
                case 'short':
                    summaryLength = "Provide a brief summary in 2-3 sentences.";
                    break;
                case 'long':
                    summaryLength = "Provide a detailed summary (about a paragraph).";
                    break;
                default:
                    summaryLength = "Provide a concise summary (about 5-6 sentences).";
            }

            //Generate summary using Ollama
            const summary = await ollamaService.generateResponse(`Please provide a ${summaryLength} summary of the following document content:\n\n${content.substring(0, 8000)}`) // Limit content to avoid token limits
            console.log("This is the generated summary: ", summary);

            res.json({
                documentId: id,
                title: document.title,
                summary,
                length: length || 'concise'
            })
            console.log("Generated summary:", summary);
        } catch (error) {
            console.error('Error summarizing document:', error);
            res.status(500).json({ error: 'Failed to generate summary' });
        }
    }

}
