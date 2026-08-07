import express from 'express';
import auth from '../middleware/auth.js';
import { createDocument, getDocument, updateDocument, getDocumentsByProject, deleteDocument } from '../controllers/documentController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(auth);

router.post('/', upload.single('file'), createDocument);
router.get('/project/:projectId', getDocumentsByProject);
router.get('/:id', getDocument);
router.put('/:id', upload.single('file'), updateDocument);
router.delete('/:id', deleteDocument);

export default router;