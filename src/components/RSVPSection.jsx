
import React from 'react';
import { Link } from 'react-router-dom';

const RSVPSection = ({ currentUser, userRsvp, onRsvp, isEventPast }) => {
  if (isEventPast) {
    return null;
  }

  return (
    <div className="rsvp-section">
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>Will you be attending?</h3>
      
      {currentUser ? (
        <div className="rsvp-buttons">
          <button
            className={`rsvp-btn ${userRsvp === 'attending' ? 'active' : ''}`}
            onClick={() => onRsvp('attending')}
          >
            ✅ Yes, I'll be there
          </button>
          <button
            className={`rsvp-btn ${userRsvp === 'maybe' ? 'active' : ''}`}
            onClick={() => onRsvp('maybe')}
          >
            🤔 Maybe
          </button>
          <button
            className={`rsvp-btn ${userRsvp === 'declined' ? 'active' : ''}`}
            onClick={() => onRsvp('declined')}
          >
            ❌ Can't make it
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Please log in to RSVP to this event
          </p>
          <Link to="/login" className="btn btn-primary">
            Log In to RSVP
          </Link>
        </div>
      )}
    </div>
  );
};

export default RSVPSection;
