import Document from '../models/documentModel.js';
import User from '../models/userModel.js';
import { getFile, createFile, updateFile } from '../services/githubService.js';

const getGithubToken = async (userId) => {
    const user = await User.findById(userId).select('githubAccessToken');
    if (!user || !user.githubToken) {
        const err = new Error(`Github account is not connected`);
        err.status = 400;
        throw err;
    }
    return user.githubToken;
};


export const createDocument = async (req, res) => {
    try {
        const { title, kind, project, content, owner, repo, path, branch } = req.body;

        if (!title || !kind || !project) {
            return res.status(400).json({ message: 'Title, kind, and project are required fields.' });
        }

        if (kind === 'native') {
            if (!content) {
                return res.status(400).json({ message: 'Content is required for native documents.' });
            }
            const newDocument = new Document({
                title, kind, project, content,
                createdBy: req.user.userId
            });
            await newDocument.save();
            return res.status(201).json(newDocument);
        }

        if (kind === 'git') {
            if (!content || !owner || !repo || !path) {
                return res.status(400).json({ message: 'Content, owner, repo, and path are required for Git documents.' });
            }
            const token = await getGithubToken(req.user.userId);
            const file = await createFile(token, owner, repo, path, content, `Create ${title} via CandleByte CMS`);

            const newDocument = new Document({
                title, kind, project, content, owner, repo, path,
                branch: branch || 'main',
                sha: file.sha,
                createdBy: req.user.userId
            });

            await newDocument.save();
            return res.status(201).json(newDocument);
        }
        return res.status(400).json({ message: 'Uploads are not supported yet.' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'An error occurred while creating the document.' });
    }
};

