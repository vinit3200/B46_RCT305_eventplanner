
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { events, rsvpToEvent, deleteEvent } = useEvents();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userRsvp, setUserRsvp] = useState(null);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === id);
    setEvent(foundEvent);
    
    if (foundEvent && currentUser) {
      // Find user's current RSVP status
      if (foundEvent.rsvps.attending.includes(currentUser.uid)) {
        setUserRsvp('attending');
      } else if (foundEvent.rsvps.maybe.includes(currentUser.uid)) {
        setUserRsvp('maybe');
      } else if (foundEvent.rsvps.declined.includes(currentUser.uid)) {
        setUserRsvp('declined');
      }
    }
  }, [id, events, currentUser]);

  const handleRsvp = async (status) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      await rsvpToEvent(id, status);
      setUserRsvp(status);
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        navigate('/events');
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  if (!event) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const isEventCreator = currentUser && event.createdBy === currentUser.uid;
  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="fade-in">
      <div className="card">
        <div className="event-image" style={{ height: '300px', marginBottom: '2rem' }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem'
          }}>
            🎉
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
          <div>
            <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {event.title}
            </h1>
            <div className="event-meta" style={{ fontSize: '1.1rem', gap: '2rem' }}>
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>🕒 {event.time}</span>
              <span>📍 {event.location}</span>
              <span>🏷️ {event.category}</span>
            </div>
          </div>
          
          {isEventCreator && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary">Edit</button>
              <button className="btn btn-danger" onClick={handleDeleteEvent}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="card-header">
          <h2 className="card-title">About This Event</h2>
        </div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '2rem' }}>
          {event.description}
        </p>

        {!isEventPast && (
          <div className="rsvp-section">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Will you be attending?</h3>
            
            {currentUser ? (
              <div className="rsvp-buttons">
                <button
                  className={`rsvp-btn ${userRsvp === 'attending' ? 'active' : ''}`}
                  onClick={() => handleRsvp('attending')}
                >
                  ✅ Yes, I'll be there
                </button>
                <button
                  className={`rsvp-btn ${userRsvp === 'maybe' ? 'active' : ''}`}
                  onClick={() => handleRsvp('maybe')}
                >
                  🤔 Maybe
                </button>
                <button
                  className={`rsvp-btn ${userRsvp === 'declined' ? 'active' : ''}`}
                  onClick={() => handleRsvp('declined')}
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
        )}

        <div className="rsvp-stats">
          <div className="rsvp-stat">
            <div className="rsvp-count">{event.rsvps.attending.length}</div>
            <div className="rsvp-label">Attending</div>
          </div>
          <div className="rsvp-stat">
            <div className="rsvp-count">{event.rsvps.maybe.length}</div>
            <div className="rsvp-label">Maybe</div>
          </div>
          <div className="rsvp-stat">
            <div className="rsvp-count">{event.rsvps.declined.length}</div>
            <div className="rsvp-label">Declined</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Event Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <strong>Date & Time:</strong>
            <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
          </div>
          <div>
            <strong>Location:</strong>
            <p>{event.location}</p>
          </div>
          <div>
            <strong>Category:</strong>
            <p style={{ textTransform: 'capitalize' }}>{event.category}</p>
          </div>
          <div>
            <strong>Visibility:</strong>
            <p>{event.isPublic ? 'Public Event' : 'Private Event'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
