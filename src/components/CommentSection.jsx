
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

const CommentSection = ({ eventId, comments = [] }) => {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addComment } = useEvents();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setLoading(true);
      await addComment(eventId, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Comments ({comments.length})</h3>
      
      {currentUser && (
        <form onSubmit={handleSubmitComment} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... You can use emojis! 😊🎉❤️"
              className="form-textarea"
              rows="3"
              style={{ resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            No comments yet. Be the first to comment! 💬
          </p>
        ) : (
          comments
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
              return dateB - dateA;
            })
            .map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#333' }}>{comment.userName}</strong>
                  <small style={{ color: '#666' }}>
                    {formatDate(comment.createdAt)}
                  </small>
                </div>
                <p style={{ margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
