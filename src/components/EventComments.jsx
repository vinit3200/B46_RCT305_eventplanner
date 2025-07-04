
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const EventComments = ({ eventId }) => {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const emojis = ['😊', '👍', '❤️', '🎉', '👏', '🔥', '💯', '🙌', '😍', '🤩'];

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
    });

    return unsubscribe;
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        eventId,
        userId: currentUser.uid,
        userName: userProfile?.displayName || 'Anonymous',
        text: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    setLoading(false);
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji);
  };

  return (
    <div className="comments-section" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>Comments</h3>
      
      {currentUser ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="hover-scale"
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this event..."
              className="form-textarea"
              rows="3"
              style={{ width: '100%' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary hover-scale"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Please log in to comment on this event.
        </p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment, index) => (
            <div 
              key={comment.id} 
              className="comment animate-fade-in"
              style={{
                padding: '1rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '1rem',
                backgroundColor: '#fafafa',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#333' }}>{comment.userName}</strong>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </span>
              </div>
              <p style={{ margin: 0, lineHeight: '1.5' }}>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventComments;
