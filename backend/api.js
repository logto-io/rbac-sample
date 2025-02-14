const express = require('express');
const router = express.Router();
const { requireAuth, hasScopes } = require('./middleware/auth');
const { nanoid } = require('nanoid');
const articleDB = require('./db/articles');

// List articles
router.get('/articles', requireAuth(), async (req, res) => {
  try {
    // If user has list:articles scope, return all articles
    if (hasScopes(req.user.scopes, ['list:articles'])) {
      const articles = await articleDB.list();
      return res.json(articles);
    }

    // Otherwise, return only user's articles
    const articles = await articleDB.listByOwner(req.user.id);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get article by ID
router.get('/articles/:id', requireAuth(), async (req, res) => {
  try {
    const article = await articleDB.getById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // If user has read:articles scope or is the owner, allow access
    if (hasScopes(req.user.scopes, ['read:articles']) || article.ownerId === req.user.id) {
      return res.json(article);
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create article
router.post('/articles', requireAuth(['create:articles']), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const article = {
      id: nanoid(6),
      ownerId: req.user.id,
      title,
      content,
      createdAt: new Date().toISOString(),
      isPublished: false
    };

    const created = await articleDB.create(article);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article
router.patch('/articles/:id', requireAuth(), async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await articleDB.getById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // If user has update:articles scope or is the owner, allow update
    if (!hasScopes(req.user.scopes, ['update:articles']) && article.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = {
      title: title || article.title,
      content: content || article.content,
    };

    const updated = await articleDB.update(req.params.id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
router.delete('/articles/:id', requireAuth(), async (req, res) => {
  try {
    const article = await articleDB.getById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await articleDB.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Update article publish status
router.patch('/articles/:id/published', requireAuth(['publish:articles']), async (req, res) => {
  try {
    const article = await articleDB.getById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await articleDB.update(req.params.id, {
      isPublished: !article.isPublished
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article status' });
  }
});

module.exports = router; 
