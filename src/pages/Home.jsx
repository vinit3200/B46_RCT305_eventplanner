
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

const Home = () => {
  const { currentUser } = useAuth();
  const { events, getUpcomingEvents } = useEvents();
  
  const upcomingEvents = getUpcomingEvents().slice(0, 3);

  return (
    <div className="fade-in">
      <section className="hero">
        <h1 className="hero-title">Create Amazing Events</h1>
        <p className="hero-subtitle">
          The modern way to organize, manage, and share your events with the world.
          From intimate gatherings to large celebrations, we've got you covered.
        </p>
        <div className="hero-actions">
          {currentUser ? (
            <Link to="/create-event" className="btn btn-primary">
              Create Your First Event
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">
                Get Started Free
              </Link>
              <Link to="/events" className="btn btn-secondary">
                Browse Events
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Why Choose EventHub?</h2>
        <div className="events-grid">
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 Easy Event Creation</h3>
            <p>Our intuitive wizard guides you through creating perfect events in minutes, not hours.</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>📊 Smart RSVP Tracking</h3>
            <p>Visual dashboards and automated reminders keep you organized and your guests informed.</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🌐 Social Integration</h3>
            <p>Share your events across social platforms and build engaging communities around your events.</p>
          </div>
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Events</h2>
            <p className="card-subtitle">Don't miss out on these amazing events</p>
          </div>
          <div className="events-grid">
            {upcomingEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image"></div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="event-description">
                    {event.description.substring(0, 100)}...
                  </p>
                  <div className="event-actions">
                    <Link to={`/event/${event.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/events" className="btn btn-secondary">
              View All Events
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
