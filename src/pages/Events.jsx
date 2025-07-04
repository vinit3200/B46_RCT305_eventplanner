
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';

const Events = () => {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
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
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Discover Events</h1>
          <p className="card-subtitle">Find amazing events happening around you</p>
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
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No events found</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create an event!'}
          </p>
          <Link to="/create-event" className="btn btn-primary">
            Create New Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image"></div>
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
                  <Link to={`/event/${event.id}`} className="btn btn-primary">
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
