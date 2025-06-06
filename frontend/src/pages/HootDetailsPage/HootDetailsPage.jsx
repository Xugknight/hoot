import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as hootService from '../../services/hootService';

export default function HootDetailsPage({ user }) {
  const { hootId } = useParams();
  const navigate = useNavigate();

  const [hoot, setHoot] = useState(null);
  const [formData, setFormData] = useState({ text: '' });
  const [error, setError] = useState('');

  // 1) Fetch the hoot (with populated author and comments.author) on mount
  useEffect(() => {
    async function fetchHoot() {
      try {
        const data = await hootService.show(hootId);
        setHoot(data);
      } catch (err) {
        console.log(err.message);
        setError('Failed to load hoot.');
      }
    }
    fetchHoot();
  }, [hootId]);

  // 2) If not yet loaded, show a loading state
  if (!hoot) return <main>Loading…</main>;

  // 3) Handler to delete the hoot (only if current user is author)
  async function handleDelete() {
    try {
      await hootService.deleteHoot(hootId);
      navigate('/hoots');
    } catch (err) {
      console.log(err.message);
      setError('Failed to delete hoot.');
    }
  }

  // 4) Handler to submit a new comment
  async function handleCommentSubmit(evt) {
    evt.preventDefault();
    if (!formData.text.trim()) return;
    try {
      // Since comments are embedded, we push via hootService.addComment
      // (Assuming hootService has an addComment function. If not, use commentService.)
      const newComment = await hootService.addComment(hootId, {
        text: formData.text,
      });
      // Reload hoot from server so that new comment appears with populated author
      const updated = await hootService.show(hootId);
      setHoot(updated);
      setFormData({ text: '' });
    } catch (err) {
      console.log(err.message);
      setError('Failed to post comment.');
    }
  }

  return (
    <main>
      {error && <p className="error">{error}</p>}

      {/* Hoot Details Section */}
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <p>
            {`${hoot.author.name} posted on
              ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
        </header>
        <p>{hoot.text}</p>

        {/* Show Edit/Delete only if current user is the author */}
        {user && hoot.author._id === user._id && (
          <div>
            <button onClick={() => navigate(`/hoots/${hootId}/edit`)}>
              Edit Hoot
            </button>
            <button onClick={handleDelete}>Delete Hoot</button>
          </div>
        )}
      </section>

      <hr />

      {/* Comments Section */}
      <section>
        <h2>Comments</h2>

        {/* If there are no comments */}
        {!hoot.comments.length && <p>There are no comments.</p>}

        {/* Map over comments */}
        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.name} posted on
                  ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            <p>{comment.text}</p>

            {/* If current user is comment author, show edit/delete buttons */}
            {user && comment.author._id === user._id && (
              <div>
                <button
                  onClick={async () => {
                    try {
                      const updatedText = prompt(
                        'Edit your comment:',
                        comment.text
                      );
                      if (!updatedText) return;
                      await hootService.updateComment(
                        hootId,
                        comment._id,
                        { text: updatedText }
                      );
                      // Refresh hoot to get updated comments
                      const refreshed = await hootService.show(hootId);
                      setHoot(refreshed);
                    } catch (err) {
                      console.log(err.message);
                      setError('Failed to update comment.');
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await hootService.deleteComment(hootId, comment._id);
                      // Refresh hoot to remove deleted comment
                      const refreshed = await hootService.show(hootId);
                      setHoot(refreshed);
                    } catch (err) {
                      console.log(err.message);
                      setError('Failed to delete comment.');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}

        {/* New Comment Form (only for signed-in users) */}
        {user && (
          <form onSubmit={handleCommentSubmit}>
            <label>
              Add a comment:
              <textarea
                name="text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ text: e.target.value })
                }
                required
              />
            </label>
            <button type="submit">Post Comment</button>
          </form>
        )}
      </section>
    </main>
  );
}