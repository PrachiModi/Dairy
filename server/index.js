import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './db.js';
import { v4 as uuid } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../client/dist')));

// API Routes

// Get all articles (private ones only for owner, public for everyone)
app.get('/api/articles', (req, res) => {
  const isOwner = req.query.owner === 'true';

  if (isOwner) {
    db.all('SELECT * FROM articles ORDER BY createdAt DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    db.all('SELECT * FROM articles WHERE isPublic = 1 ORDER BY createdAt DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// Get single article by slug
app.get('/api/articles/:slug', (req, res) => {
  db.get('SELECT * FROM articles WHERE slug = ?', [req.params.slug], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Article not found' });
    if (!row.isPublic) return res.status(403).json({ error: 'This article is private' });
    res.json(row);
  });
});

// Create article
app.post('/api/articles', (req, res) => {
  const { title, content, type } = req.body;
  if (!title || !content || !type) {
    return res.status(400).json({ error: 'Title, content, and type are required' });
  }

  const id = uuid();
  const slug = generateSlug(title);
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO articles (id, title, content, type, isPublic, createdAt, updatedAt, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, content, type, 0, now, now, slug],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, title, content, type, isPublic: 0, createdAt: now, updatedAt: now, slug });
    }
  );
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  const { title, content, isPublic } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE articles SET title = ?, content = ?, isPublic = ?, updatedAt = ? WHERE id = ?',
    [title, content, isPublic ? 1 : 0, now, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Article not found' });
      res.json({ success: true });
    }
  );
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  db.run('DELETE FROM articles WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
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
