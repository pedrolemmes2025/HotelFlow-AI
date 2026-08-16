import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Multi-tenant API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HotelFlow AI Engine',
    version: '1.0.0-phase1',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  return res.json({
    success: true,
    token: `session_token_${Date.now()}`,
    user: {
      email,
      role: email.includes('admin') ? 'HOTEL_ADMIN' : 'STAFF',
    },
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HotelFlow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
