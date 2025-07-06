
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const EventComments = ({ eventId }) => {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const q = query(
      collection(db, 'eventComments'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'asc')
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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'eventComments'), {
        eventId,
        userId: currentUser.uid,
        userDisplayName: userProfile?.displayName || currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        content: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    if (currentUser.uid !== commentUserId) return;
    
    try {
      await deleteDoc(doc(db, 'eventComments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h3 className="card-title">Discussion ({comments.length})</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
          Share your thoughts about this event
        </p>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmitComment} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <textarea
              className="form-textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this event..."
              rows="3"
              required
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
      ) : (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Please log in to join the discussion
          </p>
          <a href="/login" className="btn btn-primary">
            Log In to Comment
          </a>
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="comment"
              style={{ 
                padding: '1.5rem',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {comment.userDisplayName?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                      {comment.userDisplayName || 'Anonymous'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {formatTimestamp(comment.createdAt)}
                    </div>
                  </div>
                </div>
                {currentUser && currentUser.uid === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id, comment.userId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ 
                margin: 0, 
                lineHeight: '1.5',
                fontSize: '0.95rem',
                marginLeft: '2.5rem'
              }}>
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventComments;
