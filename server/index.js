import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';
import db from './db.js';
import { v4 as uuid } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from client dist folder
const staticPath = resolve(__dirname, '../client/dist');
console.log('Serving static files from:', staticPath);
console.log('Static path exists:', existsSync(staticPath));
app.use(express.static(staticPath));

// API Routes

// Get all articles (private ones only for owner, public for everyone)
app.get('/api/articles', async (req, res) => {
  try {
    const isOwner = req.query.owner === 'true';
    const query = isOwner
      ? 'SELECT * FROM articles ORDER BY createdAt DESC'
      : 'SELECT * FROM articles WHERE isPublic = 1 ORDER BY createdAt DESC';

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single article by slug
app.get('/api/articles/:slug', async (req, res) => {
  try {
    console.log('Fetching article by slug:', req.params.slug);
    const result = await db.query('SELECT * FROM articles WHERE slug = $1', [req.params.slug]);
    const row = result.rows[0];

    console.log('Found article:', row);
    if (!row) return res.status(404).json({ error: 'Article not found' });
    if (!row.isPublic) return res.status(403).json({ error: 'This article is private' });
    res.json(row);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create article
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Title, content, and type are required' });
    }

    const id = uuid();
    const slug = generateSlug(title);
    const now = new Date().toISOString();

    console.log('Creating article:', { id, title, type, slug });

    await db.query(
      'INSERT INTO articles (id, title, content, type, isPublic, createdAt, updatedAt, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, title, content, type, 0, now, now, slug]
    );

    console.log('Article created successfully');
    res.status(201).json({ id, title, content, type, isPublic: 0, createdAt: now, updatedAt: now, slug });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const now = new Date().toISOString();

    console.log('Updating article:', { id: req.params.id, title, isPublic });
    const result = await db.query(
      'UPDATE articles SET title = $1, content = $2, isPublic = $3, updatedAt = $4 WHERE id = $5',
      [title, content, isPublic ? 1 : 0, now, req.params.id]
    );

    console.log('Update result:', { rowCount: result.rowCount });
    if (result.rowCount === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM articles WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Date.now();
}
