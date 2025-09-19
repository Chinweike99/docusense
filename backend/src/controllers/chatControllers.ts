import { Request, Response } from "express";
import { prisma } from "../utils/database";
import { documentController } from "./documentControllers";
import { Document } from "@prisma/client";
import { ollamaService } from "../services/ollama-service";
import { AnyARecord } from "dns";




export const chatController  = {
    // Create new chat
    async createChat(req: Request, res: Response){
        try {
            const {title} = req.body;

            const chat = await prisma.chat.create({
                data:{
                    title: title || "New Chat"
                }
            });
            res.status(201).json({
                chat: chat
            })
        } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).json({ error: 'Failed to create chat' });
        }
    },

    async getChats(req: Request, res: Response){
        try {
            const chats = await prisma.chat.findMany({
                orderBy: {updatedAt: 'desc'},
                include: {
                    messages: {
                        orderBy: {createdAt: 'asc'},
                        take: 1 // Get only the first message for preview
                    }
                }
            })
            res.status(200).json({chat: chats})
        } catch (error) {
             console.error('Error fetching chats:', error);
             res.status(500).json({ error: 'Failed to fetch chats' });
        }
    },

    // Get a chat by ID with all messages
    async getChatById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const chat = await prisma.chat.findUnique({
                where: {id},
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });

            if(!chat){
                return res.status(404).json({ error: 'Chat not found' });
            }
            res.json({chat: chat})
        } catch (error) {
            console.error('Error fetching chat:', error);
            res.status(500).json({ error: 'Failed to fetch chat' });
        }
    },

    async deleteChat(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if chat exists
      const chat = await prisma.chat.findUnique({
        where: { id },
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      await prisma.chat.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ error: 'Failed to delete chat' });
    }
  },

  // Send message to a chat
  async sendMessage(req: Request, res: Response){
        try {
            const {id} = req.params;
            const {content} = req.body;

            const chat = await prisma.chat.findUnique({where: {id}});
            if(!chat){
                res.status(404).json({error: "Chat does not exixt"})
            }

            // Create user message
            const userMessage = await prisma.message.create({
                data: {
                    content: content,
                    role: 'user',
                    chatId: id
                },
            });

            // Retrieve relevant documents using RAG
            // const relevantDocument = await documentController.searchDocument(
            //     { body: {query: content}} as Request,
            //     { json: (docs: any) => docs} as Response
            // )
            const relevantDocument = await documentController.searchDocumentInternal(content);


            // Build context from relevant documents
            let context: any = '';
            if(relevantDocument && Array.isArray(relevantDocument)){
                context = relevantDocument.slice(0, 3).map((doc: any) => `Document: ${doc.title}\nContent: ${doc.content}`).join('\n\n')
            };

            // create prompt
            const prompt = context ? `Based o the folloeing context:\n\n${context}\n\nAnswer this question ${content}` : content;

            const assistantResponse = await ollamaService.generateResponse(prompt)
            // Create assistant message
            const assistantmessage = await prisma.message.create({
                data: {
                    content: assistantResponse,
                    role: 'assistant',
                    chatId: id
                }
            });

            // Update chats timestamp
            await prisma.chat.update({
                where: {id},
                data: {updatedAt: new Date()}
            });

            res.json({
                userMessage,
                assistantmessage,
                context: relevantDocument || []
            })

        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Failed to send message' })
        }
  }

}

