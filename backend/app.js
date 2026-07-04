import express from 'express';
import authRoutes from './routes/authRoutes.js';
import auth from './middleware/auth.js';

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send({ status: "ok" });
});
app.use('/api/auth', authRoutes);
app.get('/api/protected', auth, (req, res) => {
    res.send({ message: "This is a protected route.", user: req.user });
});

export default app;

