import express from 'express';
import auth from '../middleware/auth.js';
import { connectGithub } from '../controllers/githubController.js';
import { githubCallback } from '../controllers/githubController.js';

const router = express.Router();
router.get('/callback', githubCallback);
router.use(auth);

router.get('/connect', connectGithub);


export default router;

