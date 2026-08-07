import Document from '../models/Document.js';
import User from '../models/User.js';
import { getFile, createFile, updateFile, deleteFile } from '../services/githubService.js';
import { uploadS3File, getS3FileUrl, deleteS3File } from '../services/s3Service.js';

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

        if (kind === 'upload') {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'File is required for upload documents.' });
            }
            const key = `${project}/${Date.now()}-${file.originalname}`;
            await uploadS3File(file.buffer, key, file.mimetype);
            const newDocument = new Document({
                title, kind, project, fileUrl: key, mimeType: req.file.mimetype, fileSize: req.file.size,
                createdBy: req.user.userId
            });

            await newDocument.save();
            return res.status(201).json(newDocument);
        }

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
            const fileUrl = await getS3FileUrl(document.fileUrl);
            return res.status(200).json({ ...document.toObject(), fileUrl });
        }

    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'An error occurred while fetching the document.' });
    }
}

export const updateDocument = async (req, res) => {
    const { content, title } = req.body;
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (document.kind === 'native') {
            if (!content) {
                return res.status(400).json({ message: 'Content is required for updating the document.' });
            }
            document.content = content;
            document.lastEditedBy = req.user.userId;
            await document.save();
            return res.status(200).json(document);
        }

        if (document.kind === 'git') {
            if (!content) {
                return res.status(400).json({ message: 'Content is required for updating the document.' });
            }
            const token = await getGithubToken(req.user.userId);
            const updatedFile = await updateFile(token, document.owner, document.repo, document.path, content, `Update ${document.title} via CandleByte CMS`, document.sha);
            document.content = content;
            document.sha = updatedFile.sha;
            document.lastEditedBy = req.user.userId;
            await document.save();
            return res.status(200).json(document);
        }

        if (document.kind === 'upload') {
            if (!req.file && !title) {
                return res.status(400).json({ message: 'Nothing to update. Send a file or a title.' });
            }

            if (req.file) {
                const oldKey = document.fileUrl;
                const newKey = `${document.project}/${Date.now()}-${req.file.originalname}`;

                await uploadS3File(req.file.buffer, newKey, req.file.mimetype);
                await deleteS3File(oldKey);

                document.fileUrl = newKey;
                document.mimeType = req.file.mimetype;
                document.fileSize = req.file.size;
            }

            if (title) {
                document.title = title;
            }

            document.lastEditedBy = req.user.userId;
            await document.save();
            return res.status(200).json(document);
        }

    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'An error occurred while updating the document.' });
    }
}

export const getDocumentsByProject = async (req, res) => {
    try {
        const documents = await Document.find({ project: req.params.projectId });
        return res.status(200).json(documents);
    }
    catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'An error occurred while fetching documents for the project.' });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.kind === 'native') {
            await document.deleteOne();
            return res.status(200).json({ message: 'Document deleted successfully,' });
        }
        if (document.kind === 'git') {
            const token = await getGithubToken(req.user.userId);
            await deleteFile(token, document.owner, document.repo, document.path, `Delete ${document.title} via CandleByte CMS`, document.sha);
            await document.deleteOne();
            return res.status(200).json({ message: 'Document deleted successfully,' });
        }
        if (document.kind === 'upload') {
            await deleteS3File(document.fileUrl);
            await document.deleteOne();
            return res.status(200).json({ message: 'Document deleted successfully.' });
        }
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'An error occurred while deleting the document.' });
    }
}