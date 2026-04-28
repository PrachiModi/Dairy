import { useState, useEffect } from 'react';
import './styles/PublicArticle.css';

function PublicArticle() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const slug = window.location.pathname.split('/article/')[1];
    fetch(`/api/articles/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Article not found');
        return res.json();
      })
      .then(data => setArticle(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="public-view"><p>Loading...</p></div>;
  if (error) return <div className="public-view"><p className="error">Error: {error}</p></div>;
  if (!article) return <div className="public-view"><p>Article not found</p></div>;

  return (
    <div className="public-view">
      <div className="public-container">
        <h1>{article.title}</h1>
        <div className="meta">
          <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="content">
          {article.content}
        </div>
      </div>
    </div>
  );
}

export default PublicArticle;
