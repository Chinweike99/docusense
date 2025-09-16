import { Router } from 'express';
import { documentController } from '../controllers/documentControllers';

const router = Router();

router.post('/documents', documentController.createDocument);
router.get('/documents', documentController.getDocuments);
router.get('/documents/:id', documentController.getDocumentById);
router.put('/documents/:id', documentController.updateDocument);
router.delete('/documents/:id', documentController.deleteDocument);
router.post('/documents/search', documentController.searchDocument);

export default router;
