// src/routes/chatRoutes.ts
import { Router } from 'express';
import { chatController } from '../controllers/chatControllers';

const router = Router();

router.post('/', chatController.createChat);
router.get('/', chatController.getChats);
router.get('/:id', chatController.getChatById);
router.delete('/:id', chatController.deleteChat);
router.post('/:id/messages', chatController.sendMessage);

export default router;