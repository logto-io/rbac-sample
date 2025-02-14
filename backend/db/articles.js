/**
 * Test storage for demo purposes
 * Replace with database in production
 */
const fs = require('fs').promises;
const path = require('path');

class ArticleDB {
  constructor() {
    this.dataPath = path.join(__dirname, 'data', 'articles.json');
    this.articles = [];
  }

  async init() {
    try {
      await fs.access(this.dataPath);
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.articles = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty array
      this.articles = [];
      // Create the file
      await this.save();
    }
  }

  async save() {
    await fs.writeFile(this.dataPath, JSON.stringify(this.articles, null, 2), 'utf8');
  }

  async list() {
    return this.articles;
  }

  async listByOwner(ownerId) {
    return this.articles.filter(article => article.ownerId === ownerId);
  }

  async getById(id) {
    return this.articles.find(article => article.id === id);
  }

  async create(article) {
    this.articles.push(article);
    await this.save();
    return article;
  }

  async update(id, updates) {
    const index = this.articles.findIndex(article => article.id === id);
    if (index === -1) return null;

    const updatedArticle = {
      ...this.articles[index],
      ...updates
    };
    this.articles[index] = updatedArticle;
    await this.save();
    return updatedArticle;
  }

  async delete(id) {
    const index = this.articles.findIndex(article => article.id === id);
    if (index === -1) return false;

    this.articles.splice(index, 1);
    await this.save();
    return true;
  }
}

// Create and initialize a singleton instance
const articleDB = new ArticleDB();
// Initialize immediately
articleDB.init().catch(console.error);

module.exports = articleDB; 
