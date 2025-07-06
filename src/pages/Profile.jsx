
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

const Profile = () => {
  const { currentUser, userProfile, deleteAccount } = useAuth();
  const { events, getUserEvents } = useEvents();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  
  const userEvents = getUserEvents(currentUser?.uid || '');
  const attendingEvents = events.filter(event => 
    event.rsvps.attending.includes(currentUser?.uid || '')
  );

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    try {
      setDeleteLoading(true);
      await deleteAccount();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="profile-grid">
        <div className="card">
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
              margin: '0 auto 1rem'
            }}>
              {userProfile?.displayName?.charAt(0) || 'U'}
            </div>
            <h2 className="card-title">{userProfile?.displayName || 'User'}</h2>
            <p className="card-subtitle">{currentUser?.email}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div className="rsvp-count">{userEvents.length}</div>
              <div className="rsvp-label">Events Created</div>
            </div>
            <div>
              <div className="rsvp-count">{attendingEvents.length}</div>
              <div className="rsvp-label">Events Attending</div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ff6b6b', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
            <h4 style={{ color: '#d63031', marginBottom: '0.5rem' }}>Danger Zone</h4>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              className="btn"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                backgroundColor: '#d63031',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Events</h3>
              <Link to="/create-event" className="btn btn-primary">
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

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Events I'm Attending</h3>
            </div>
            
            {attendingEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  You haven't RSVP'd to any events yet.
                </p>
                <Link to="/events" className="btn btn-primary">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {attendingEvents.slice(0, 3).map(event => (
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
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                      </p>
                    </div>
                    <Link to={`/event/${event.id}`} className="btn btn-secondary">
                      View
                    </Link>
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

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ color: '#d63031', marginBottom: '1rem' }}>Delete Account</h3>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Are you absolutely sure you want to delete your account? This action cannot be undone and will:
            </p>
            <ul style={{ marginBottom: '1.5rem', color: '#666', paddingLeft: '1.5rem' }}>
              <li>Permanently delete your profile</li>
              <li>Remove all your created events</li>
              <li>Remove your RSVPs from all events</li>
              <li>Delete all your comments</li>
            </ul>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                style={{
                  backgroundColor: '#d63031',
                  color: 'white',
                  border: 'none'
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
