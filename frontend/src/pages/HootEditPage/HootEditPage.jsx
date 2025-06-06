// src/pages/HootEditPage/HootEditPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as hootService from '../../services/hootService';

export default function HootEditPage({ user }) {
  const { hootId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', text: '', category: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHoot() {
      try {
        const data = await hootService.show(hootId);
        // Pre‐fill form fields
        setFormData({ title: data.title, text: data.text, category: data.category });
      } catch (err) {
        console.log(err.message);
        setError('Failed to load hoot');
      }
    }
    fetchHoot();
  }, [hootId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hootService.update(hootId, formData);
      navigate(`/hoots/${hootId}`);
    } catch (err) {
      console.log(err.message);
      setError('Failed to update hoot');
    }
  };

  return (
    <div>
      <h1>Edit Hoot</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <label>
          Text
          <textarea name="text" value={formData.text} onChange={handleChange} required />
        </label>
        <label>
          Category
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Choose one</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
            <option value="Games">Games</option>
            <option value="Movies">Movies</option>
            <option value="Music">Music</option>
            <option value="Television">Television</option>
          </select>
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
