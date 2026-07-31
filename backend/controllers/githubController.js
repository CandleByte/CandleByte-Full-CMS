import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import { getFile, createFile } from '../services/githubService.js';

export const connectGithub = (req, res) => {
    const state = jwt.sign({ userId: req.user.userId }, env.JWT_SECRET, { expiresIn: '10m' });

    const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: env.GITHUB_REDIRECT_URI,
        scope: 'repo user',
        state: state
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

export const githubCallback = async (req, res) => {

    const { code, state, error } = req.query;

    if (error || !code) {
        return res.status(400).json({ message: 'Authorization failed. No code provided.' });
    }

    try {
        const decodedState = jwt.verify(state, env.JWT_SECRET);
        const userId = decodedState.userId;

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: env.GITHUB_REDIRECT_URI
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            return res.status(400).json({ message: 'Could not obtain access token.' });
        }

        await User.findByIdAndUpdate(userId, { githubAccessToken: tokenData.access_token });

        res.status(200).json({ message: 'GitHub account connected successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const testGithubWrite = async (req, res) => {
    const user = await User.findById(req.user.userId).select('+githubAccessToken');

    if (!user || !user.githubAccessToken) {
        return res.status(400).json({ message: 'GitHub account not connected.' });
    }

    try {
        const result = await createFile(
            user.githubAccessToken,
            'CandleByte',
            'CMS_test',
            'docs/hello.md',
            '# Hello from CandleByte CMS\nThis is a test file created via the GitHub API.',
            'Add hello.md via API'
        );
        res.status(201).json({ message: 'File created successfully on GitHub.', result });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};