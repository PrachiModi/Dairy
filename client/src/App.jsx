import { useState, useEffect } from 'react';
import WritingPad from './components/WritingPad';
import ArticleList from './components/ArticleList';
import PublicArticle from './PublicArticle';
import './App.css';

function App() {
  const isPublicView = window.location.pathname.startsWith('/article/');

  if (isPublicView) {
    return <PublicArticle />;
  }
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/articles?owner=true');
      const data = await res.json();
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleArticleCreate = async (title, content, type) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type })
      });
      const newArticle = await res.json();
      setArticles([newArticle, ...articles]);
      setIsWriting(false);
      setSelectedArticle(newArticle);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const handleArticleUpdate = async (id, title, content, isPublic) => {
    try {
      await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, isPublic })
      });
      const updated = articles.map(a =>
        a.id === id ? { ...a, title, content, isPublic } : a
      );
      setArticles(updated);
      setSelectedArticle({ ...selectedArticle, title, content, isPublic });
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleArticleDelete = async (id) => {
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a.id !== id));
      if (selectedArticle?.id === id) setSelectedArticle(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📔 Diary Perspective</h1>
      </header>

      <div className="container">
        <div className="left-panel">
          {isWriting ? (
            <WritingPad
              article={selectedArticle}
              onSave={selectedArticle ?
                (title, content, type) => handleArticleUpdate(selectedArticle.id, title, content, selectedArticle.isPublic) :
                handleArticleCreate
              }
              onCancel={() => {
                setIsWriting(false);
                setSelectedArticle(null);
              }}
            />
          ) : (
            <div className="view-mode">
              {selectedArticle ? (
                <ArticleView
                  article={selectedArticle}
                  onEdit={() => setIsWriting(true)}
                  onDelete={() => handleArticleDelete(selectedArticle.id)}
                  onTogglePublic={(isPublic) => handleArticleUpdate(selectedArticle.id, selectedArticle.title, selectedArticle.content, isPublic)}
                />
              ) : (
                <div className="no-article">
                  <p>No article selected</p>
                </div>
              )}
              <button className="btn-primary" onClick={() => {
                setSelectedArticle(null);
                setIsWriting(true);
              }}>
                ✏️ Pen It Down
              </button>
            </div>
          )}
        </div>

        <div className="right-panel">
          <ArticleList
            articles={articles}
            selectedArticle={selectedArticle}
            onSelectArticle={setSelectedArticle}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

function ArticleView({ article, onEdit, onDelete, onTogglePublic }) {
  const date = new Date(article.createdAt).toLocaleDateString();

  return (
    <div className="article-view">
      <div className="article-header">
        <h2>{article.title}</h2>
        <div className="article-meta">
          <span className="badge">{article.type}</span>
          <span className="date">{date}</span>
        </div>
      </div>

      <div className="article-content">
        {article.content.split('\n').map((line, i) => (
          <div key={i}>{line || ' '}</div>
        ))}
      </div>

      <div className="article-actions">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={article.isPublic}
            onChange={(e) => onTogglePublic(e.target.checked)}
          />
          Public
        </label>
        {article.isPublic && (
          <span className="share-link">
            Share: <code>{window.location.origin}/article/{article.slug}</code>
          </span>
        )}
        <button className="btn-secondary" onClick={onEdit}>Edit</button>
        <button className="btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default App;
