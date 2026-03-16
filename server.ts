import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Database Connection
const pool = new Pool({
  host: process.env.DB_HOST || '109.123.249.114',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'runweekv2',
  user: process.env.DB_USER || 'runweekv2_user',
  password: process.env.DB_PASSWORD || 'rwv2_secret_2024!',
  ssl: {
    rejectUnauthorized: false
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me';

async function initDb() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    
    // Create users table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create stories table if not exists (for the magazine)
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id),
        stats JSONB,
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create default admin user if not exists
    const adminEmail = 'maganda.igor@gmail.com';
    const adminCheck = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    if (adminCheck.rows.length === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        [adminEmail, hashedAdminPassword, 'Igor Maganda', 'admin']
      );
      console.log('Default admin user created');
    }

    client.release();
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

async function startServer() {
  // Initialize DB in background
  initDb().catch(err => console.error('Background DB init error:', err));
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
  });

  // --- Auth Routes ---

  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, hashedPassword, name, 'user']
      );
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user });
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    console.log('Login request received:', req.body.email);
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  // Me (Check session)
  app.get('/api/auth/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [decoded.id]);
      const user = result.rows[0];
      if (!user) return res.status(401).json({ error: 'User not found' });
      res.json({ user });
    } catch (err: any) {
      console.error('Me error:', err);
      res.status(401).json({ error: `Invalid token: ${err.message || err}` });
    }
  });

  // --- Stories Routes ---
  app.get('/api/stories', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.*, u.name as author_name 
        FROM stories s 
        LEFT JOIN users u ON s.author_id = u.id 
        WHERE s.status = 'published'
        ORDER BY s.created_at DESC
      `);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Fetch stories error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.get('/api/stories/:slug', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.*, u.name as author_name 
        FROM stories s 
        LEFT JOIN users u ON s.author_id = u.id 
        WHERE s.slug = $1 OR s.id::text = $1
      `, [req.params.slug]);
      
      if (result.rows.length === 0) return res.status(404).json({ error: 'Story not found' });
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Fetch story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.post('/api/stories', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const { title, content, stats, image_url, status = 'published' } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      
      const result = await pool.query(
        'INSERT INTO stories (title, slug, content, author_id, stats, image_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, slug, content, decoded.id, JSON.stringify(stats), image_url, status]
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Create story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.put('/api/stories/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const { title, content, stats, image_url, status } = req.body;
      
      // Check ownership
      const check = await pool.query('SELECT author_id FROM stories WHERE id = $1', [req.params.id]);
      if (check.rows.length === 0) return res.status(404).json({ error: 'Story not found' });
      if (check.rows[0].author_id !== decoded.id && decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        'UPDATE stories SET title = $1, content = $2, stats = $3, image_url = $4, status = $5 WHERE id = $6 RETURNING *',
        [title, content, JSON.stringify(stats), image_url, status, req.params.id]
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Update story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.delete('/api/stories/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check ownership
      const check = await pool.query('SELECT author_id FROM stories WHERE id = $1', [req.params.id]);
      if (check.rows.length === 0) return res.status(404).json({ error: 'Story not found' });
      if (check.rows[0].author_id !== decoded.id && decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await pool.query('DELETE FROM stories WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Delete story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // --- Admin Routes ---
  app.get('/api/admin/users', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const result = await pool.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err: any) {
      console.error('Admin users error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // Catch-all for API routes to prevent falling through to Vite
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
