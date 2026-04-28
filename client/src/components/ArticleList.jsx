import { useState } from 'react';
import '../styles/ArticleList.css';

function ArticleList({ articles, selectedArticle, onSelectArticle, loading }) {
  const [expandDaily, setExpandDaily] = useState(true);
  const [expandAdhoc, setExpandAdhoc] = useState(true);

  const dailyArticles = articles.filter(a => a.type === 'daily');
  const adhocArticles = articles.filter(a => a.type === 'adhoc');

  return (
    <div className="article-list">
      <h3>📚 Articles</h3>

      {loading && <p className="loading">Loading...</p>}

      <div className="article-section">
        <button
          className="section-toggle"
          onClick={() => setExpandDaily(!expandDaily)}
        >
          {expandDaily ? '▼' : '▶'} Daily Entries ({dailyArticles.length})
        </button>
        {expandDaily && (
          <ul className="article-items">
            {dailyArticles.length === 0 ? (
              <li className="empty">No daily entries yet</li>
            ) : (
              dailyArticles.map(article => (
                <li
                  key={article.id}
                  className={`article-item ${selectedArticle?.id === article.id ? 'active' : ''}`}
                  onClick={() => onSelectArticle(article)}
                >
                  <span className="article-title">{article.title}</span>
                  <span className="article-date">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  {article.isPublic && <span className="badge-public">🌐</span>}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="article-section">
        <button
          className="section-toggle"
          onClick={() => setExpandAdhoc(!expandAdhoc)}
        >
          {expandAdhoc ? '▼' : '▶'} Ad-hoc Writings ({adhocArticles.length})
        </button>
        {expandAdhoc && (
          <ul className="article-items">
            {adhocArticles.length === 0 ? (
              <li className="empty">No ad-hoc writings yet</li>
            ) : (
              adhocArticles.map(article => (
                <li
                  key={article.id}
                  className={`article-item ${selectedArticle?.id === article.id ? 'active' : ''}`}
                  onClick={() => onSelectArticle(article)}
                >
                  <span className="article-title">{article.title}</span>
                  <span className="article-date">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  {article.isPublic && <span className="badge-public">🌐</span>}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ArticleList;
