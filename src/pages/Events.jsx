
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';

const Events = () => {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Only show public events to all users
  const publicEvents = events.filter(event => event.isPublic);

  const filteredEvents = publicEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'upcoming') {
      return matchesSearch && new Date(event.date) >= new Date();
    } else if (filter === 'past') {
      return matchesSearch && new Date(event.date) < new Date();
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card animate-scale-in">
        <div className="card-header">
          <h1 className="card-title">Discover Events</h1>
          <p className="card-subtitle">Find amazing public events happening around you</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search events..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Events</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No public events found</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a public event!'}
          </p>
          <Link to="/create-event" className="btn btn-primary hover-scale">
            Create New Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="event-card animate-fade-in hover-scale"
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                transition: 'all 0.3s ease'
              }}
            >
              <div className="event-image" style={{ height: '200px', overflow: 'hidden' }}>
                {event.imageUrl ? (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem'
                  }}>
                    🎉
                  </div>
                )}
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>🕒 {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>
                <p className="event-description">
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...`
                    : event.description
                  }
                </p>
                <div className="event-actions">
                  <Link to={`/event/${event.id}`} className="btn btn-primary hover-scale">
                    View Details
                  </Link>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {event.rsvps.attending.length} attending
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
