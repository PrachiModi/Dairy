import { useState, useEffect } from 'react';
import '../styles/WritingPad.css';

function WritingPad({ article, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('adhoc');

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setType(article.type);
    }
  }, [article]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }
    onSave(title, content, type);
  };

  const isTodayDaily = () => {
    if (!article) return true;
    const today = new Date().toDateString();
    const created = new Date(article.createdAt).toDateString();
    return today === created;
  };

  return (
    <div className="writing-pad">
      <div className="writing-header">
        <input
          type="text"
          className="title-input"
          placeholder="Untitled Article"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="type-select">
          <option value="daily">Daily Entry</option>
          <option value="adhoc">Ad-hoc Writing</option>
        </select>
      </div>

      <textarea
        className="content-input"
        placeholder="Start writing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="writing-actions">
        <button className="btn-primary" onClick={handleSave}>
          {article ? 'Update' : 'Save'} Article
        </button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default WritingPad;
