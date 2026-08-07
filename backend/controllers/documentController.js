import Document from '../models/Document.js';
import User from '../models/User.js';
import { getFile, createFile, updateFile } from '../services/githubService.js';

const getGithubToken = async (userId) => {
    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
        const err = new Error('Github account is not connected');
        err.status = 400;
        throw err;
    }
    return user.githubAccessToken;
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

export const getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.kind === 'native') {
            return res.status(200).json(document);
        }
        if (document.kind === 'git') {
            const token = await getGithubToken(req.user.userId);
            const file = await getFile(token, document.owner, document.repo, document.path);
            if (!file) {
                return res.status(404).json({ message: 'File not found in Github repo.' });
            }
            document.content = file.content;
            document.sha = file.sha;
            await document.save();

            return res.status(200).json(document);
        }
        if (document.kind === 'upload') {
            return res.status(400).json({ message: 'Uploads are not supported yet.' });
        }
    }
    catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'An error occurred while fetching the document.' });
    }
}