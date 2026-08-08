import express from 'express';
import authRoutes from './routes/authRoutes.js';
import auth from './middleware/auth.js';
import projectRoutes from './routes/projectRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5174' }));

app.use(express.json());
app.get('/', (req, res) => {
    res.send({ status: "ok" });
});
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/github', githubRoutes);
app.get('/api/protected', auth, (req, res) => {
    res.send({ message: "This is a protected route.", user: req.user });
});
app.use('/api/documents', documentRoutes);
export default app;

