import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import apiRouter from './src/server/routes/api.js';
dotenv.config();
async function startServer() {
    const app = express();
    const PORT = 3000;
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    // API Routes
    app.use('/api', apiRouter);
    // Health check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', service: 'CareXpertAI Backend Engine', timestamp: new Date().toISOString() });
    });
    // Vite middleware for development vs static serve for production
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa'
        });
        app.use(vite.middlewares);
    }
    else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`CareXpertAI full-stack server running on http://0.0.0.0:${PORT}`);
    });
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
