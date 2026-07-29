import express from 'express';
import auth from '../middleware/auth.js';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../controllers/projectController.js';

const router = express.Router();
router.use(auth);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;  
