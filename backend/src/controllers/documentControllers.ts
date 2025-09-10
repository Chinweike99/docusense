import { Request, Response } from "express";
import { CreateDocumentData, DocumentModel } from "../models/Document";
import { OpenAIService } from "../services/OpenAIServices";



export const documentController = {
    async getDocuments(req: Request, res: Response) {
        try {
            const documents = await DocumentModel.findAll();
            res.json(documents)
        } catch (error) {
            console.log("Error fetching documents", error);
            res.status(500).json({ error: 'Failed to fetch documents' });
        }
    },


    async getDocument(req: Request, res: Response){
        try {
            const {id} = req.params;
        const document = await DocumentModel.findById(id);

        if(!document){
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document)
        } catch (error) {
            console.error('Error fetching document:', error);
            res.status(500).json({ error: 'Failed to fetch document' });
        }
    },

    async createDocument(req: Request, res: Response){
        try {
            const {title, content} = req.body;
            if(!title || !content){
                return res.status(400).json({ error: 'Title and content are required'})
            };

            const embedding = await OpenAIService.generateEmbedding(content);
            const documentData: CreateDocumentData = {
                title,
                content,
                embedding
            }
            const document = await DocumentModel.create(documentData)
            res.status(201).json(document);
        } catch (error) {
            console.error("Error:  ", error);
            res.status(500).json({ error: 'Failed to create document' });
        }
    },

    // UpdateDocument
    async updateDocument(req: Request, res: Response){
        try {
            const {id} = req.params;
            const {title, content} = req.body;
            
            const existingDocument = await DocumentModel.findById(id);
            if(!existingDocument){
                return res.status(404).json({ error: 'Document not found' });
            }
            // If content content changed, generate new embedding
            let embedding;
            if(content && content !== existingDocument.content){
                embedding = await OpenAIService.generateEmbedding(content);
            }

            const updateData: Partial<CreateDocumentData> = {
                ...(title && {title}),
                ...(content && {content}),
                ...(embedding && {embedding})
            };
            const document = await DocumentModel.update(id, updateData)
            res.json(document);
        } catch (error) {
            console.error('Error updating document:', error);
            res.status(500).json({ error: 'Failed to update document' });
        }
    },

    async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Check if document exists
      const document = await DocumentModel.findById(id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      await DocumentModel.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
}

}