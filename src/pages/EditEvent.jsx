import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';
import LocationPicker from '../components/LocationPicker';

const EditEvent = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { events, updateEvent } = useEvents();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    locationCoordinates: null,
    category: 'social',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
      setFormData({
        title: foundEvent.title,
        description: foundEvent.description,
        date: foundEvent.date,
        time: foundEvent.time,
        location: foundEvent.location,
        locationCoordinates: foundEvent.locationCoordinates || null,
        category: foundEvent.category,
        isPublic: foundEvent.isPublic
      });
    }
  }, [id, events]);

  if (event && currentUser && event.createdBy !== currentUser.uid) {
    navigate('/events');
    return null;
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      location: locationData.address,
      locationCoordinates: locationData.coordinates
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await updateEvent(id, formData);
      navigate(`/event/${id}`);
    } catch (error) {
      setError('Failed to update event. Please try again.');
    }
    
    setLoading(false);
  };

  if (!event) {
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
          <h1 className="card-title">Edit Event</h1>
          <p className="card-subtitle">Update your event details</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your event a catchy title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what makes your event special..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time *</label>
              <input
                type="time"
                name="time"
                className="form-input"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <LocationPicker 
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.location}
          />

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="social">Social</option>
              <option value="business">Business</option>
              <option value="educational">Educational</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts & Culture</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span className="form-label">Make this event public</span>
            </label>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Public events can be discovered by anyone. Private events are invitation-only.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating Event...' : 'Update Event'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(`/event/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
