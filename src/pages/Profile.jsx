import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const { events, getUserEvents } = useEvents();
  
  const userEvents = getUserEvents(currentUser?.uid || '');
  const attendingEvents = events.filter(event => 
    event.rsvps.attending.includes(currentUser?.uid || '')
  );

  // Get user profiles for attendees (simplified approach)
  const getUserName = (userId) => {
    // In a real app, you'd fetch user profiles from a users collection
    return `User ${userId.substring(0, 8)}`;
  };

  return (
    <div className="fade-in">
      <div className="profile-grid">
        <div className="card animate-scale-in">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              margin: '0 auto 1rem',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            className="hover-scale"
            >
              {userProfile?.displayName?.charAt(0) || 'U'}
            </div>
            <h2 className="card-title">{userProfile?.displayName || 'User'}</h2>
            <p className="card-subtitle">{currentUser?.email}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div className="hover-scale">
              <div className="rsvp-count">{userEvents.length}</div>
              <div className="rsvp-label">Events Created</div>
            </div>
            <div className="hover-scale">
              <div className="rsvp-count">{attendingEvents.length}</div>
              <div className="rsvp-label">Events Attending</div>
            </div>
          </div>
        </div>

        <div>
          <div className="card animate-fade-in">
            <div className="card-header">
              <h3 className="card-title">My Events</h3>
              <Link to="/create-event" className="btn btn-primary hover-scale">
                Create New Event
              </Link>
            </div>
            
            {userEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  You haven't created any events yet.
                </p>
                <Link to="/create-event" className="btn btn-primary">
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userEvents.slice(0, 3).map(event => (
                  <div key={event.id} style={{ 
                    padding: '1rem', 
                    border: '1px solid #eee', 
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{event.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {new Date(event.date).toLocaleDateString()} • {event.rsvps.attending.length} attending
                      </p>
                    </div>
                    <Link to={`/event/${event.id}`} className="btn btn-secondary">
                      View
                    </Link>
                  </div>
                ))}
                {userEvents.length > 3 && (
                  <Link to="/events" className="btn btn-secondary" style={{ alignSelf: 'center' }}>
                    View All My Events
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="card animate-fade-in">
            <div className="card-header">
              <h3 className="card-title">Events I'm Attending</h3>
            </div>
            
            {attendingEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  You haven't RSVP'd to any events yet.
                </p>
                <Link to="/events" className="btn btn-primary hover-scale">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {attendingEvents.slice(0, 3).map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-fade-in hover-scale"
                    style={{ 
                      padding: '1rem', 
                      border: '1px solid #eee', 
                      borderRadius: '8px',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{event.title}</h4>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                          {new Date(event.date).toLocaleDateString()} • {event.location}
                        </p>
                        
                        {/* Show attendee names */}
                        <div style={{ marginTop: '0.5rem' }}>
                          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>
                            Others attending:
                          </p>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {event.rsvps.attending
                              .filter(userId => userId !== currentUser?.uid)
                              .slice(0, 5)
                              .map(userId => (
                              <span 
                                key={userId}
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.2rem 0.5rem',
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  borderRadius: '12px'
                                }}
                              >
                                {getUserName(userId)}
                              </span>
                            ))}
                            {event.rsvps.attending.length > 6 && (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '0.2rem 0.5rem',
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                borderRadius: '12px'
                              }}>
                                +{event.rsvps.attending.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link to={`/event/${event.id}`} className="btn btn-secondary hover-scale">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
                {attendingEvents.length > 3 && (
                  <Link to="/events" className="btn btn-secondary" style={{ alignSelf: 'center' }}>
                    View All Events
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
