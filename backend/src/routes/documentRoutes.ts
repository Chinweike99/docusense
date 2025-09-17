import { Router } from 'express';
import { documentController } from '../controllers/documentControllers';
import { upload } from '../utils/fileUpload';

const router = Router();

router.post('/', documentController.createDocument);
router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.post('/search', documentController.searchDocument);
router.post('/:id/summarize', documentController.generateDocumentSummary)

export default router;
