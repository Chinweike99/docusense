import { Router } from 'express';
import { documentController } from '../controllers/documentControllers';

const router = Router();

// GET /documents - Get all documents
router.get('/', documentController.getDocuments);

// POST /documents - Create a new document
router.post('/', documentController.createDocument);

// GET /documents/:id - Get a specific document
router.get('/:id', documentController.getDocument);

// PUT /documents/:id - Update a document
router.put('/:id', documentController.updateDocument);

// DELETE /documents/:id - Delete a document
router.delete('/:id', documentController.deleteDocument);

export default router;