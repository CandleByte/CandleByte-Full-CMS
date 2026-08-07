import express from 'express';
import auth from '../middleware/auth.js';
import { createDocument, getDocument, updateDocument, getDocumentsByProject } from '../controllers/documentController.js';

const router = express.Router();
router.use(auth);

router.post('/', createDocument);
router.get('/project/:projectId', getDocumentsByProject);
router.get('/:id', getDocument);
router.put('/:id', auth, updateDocument);

export default router;


