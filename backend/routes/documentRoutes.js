import express from 'express';
import auth from '../middleware/auth.js';
import { createDocument, getDocument, updateDocument, getDocumentsByProject, deleteDocument } from '../controllers/documentController.js';

const router = express.Router();
router.use(auth);

router.post('/', createDocument);
router.get('/project/:projectId', getDocumentsByProject);
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;


