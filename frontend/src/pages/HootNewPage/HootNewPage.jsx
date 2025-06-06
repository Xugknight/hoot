import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as hootService from '../../services/hootService';

export default function HootNewPage() {
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // sendRequest is expecting an object as the payload
      await hootService.create({ content });
      navigate('/hoots');
    } catch (err) {
      setErrorMsg('Adding Hoot Failed');
    }
  }

  return (
    <>
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <label>Post Content</label>
        <input
          type="text"
          value={content}
          onChange={(evt) => setContent(evt.target.value)}
          required
        />
        <button type="submit">ADD POST</button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}