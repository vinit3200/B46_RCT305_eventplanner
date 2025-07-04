
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

const Home = () => {
  const { currentUser } = useAuth();
  const { events, getUpcomingEvents } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'social', label: 'Social' },
    { value: 'business', label: 'Business' },
    { value: 'educational', label: 'Educational' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' }
  ];

  const upcomingPublicEvents = getUpcomingEvents().filter(event => event.isPublic);
  const filteredEvents = selectedCategory === 'all' 
    ? upcomingPublicEvents.slice(0, 6)
    : upcomingPublicEvents.filter(event => event.category === selectedCategory).slice(0, 6);

  return (
    <div className="fade-in">
      <section className="hero animate-scale-in">
        <h1 className="hero-title">Create Amazing Events</h1>
        <p className="hero-subtitle">
          The modern way to organize, manage, and share your events with the world.
          From intimate gatherings to large celebrations, we've got you covered.
        </p>
        <div className="hero-actions">
          {currentUser ? (
            <Link to="/create-event" className="btn btn-primary hover-scale">
              Create Your First Event
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary hover-scale">
                Get Started Free
              </Link>
              <Link to="/events" className="btn btn-secondary hover-scale">
                Browse Events
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="card animate-fade-in">
        <h2 className="card-title">Why Choose EventHub?</h2>
        <div className="events-grid">
          <div className="card hover-scale" style={{ transform: 'rotateY(5deg) rotateX(5deg)', transition: 'transform 0.3s ease' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 Easy Event Creation</h3>
            <p>Our intuitive wizard guides you through creating perfect events in minutes, not hours.</p>
          </div>
          <div className="card hover-scale" style={{ transform: 'rotateY(-5deg) rotateX(5deg)', transition: 'transform 0.3s ease' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>📊 Smart RSVP Tracking</h3>
            <p>Visual dashboards and automated reminders keep you organized and your guests informed.</p>
          </div>
          <div className="card hover-scale" style={{ transform: 'rotateY(0deg) rotateX(-5deg)', transition: 'transform 0.3s ease' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🌐 Social Integration</h3>
            <p>Share your events across social platforms and build engaging communities around your events.</p>
          </div>
        </div>
      </section>

      {upcomingPublicEvents.length > 0 && (
        <section className="card animate-fade-in">
          <div className="card-header">
            <h2 className="card-title">Upcoming Events</h2>
            <p className="card-subtitle">Don't miss out on these amazing events</p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-scale ${
                    selectedCategory === category.value
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    transform: selectedCategory === category.value ? 'translateY(-2px)' : 'translateY(0px)',
                    boxShadow: selectedCategory === category.value ? '0 8px 20px rgba(102, 126, 234, 0.3)' : 'none'
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

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
                      fontSize: '3rem'
                    }}>
                      🎉
                    </div>
                  )}
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                    <span>🏷️ {event.category}</span>
                  </div>
                  <p className="event-description">
                    {event.description.substring(0, 100)}...
                  </p>
                  <div className="event-actions">
                    <Link to={`/event/${event.id}`} className="btn btn-primary hover-scale">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/events" className="btn btn-secondary hover-scale">
              View All Events
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
