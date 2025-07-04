
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'social',
    isPublic: true,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const { createEvent } = useEvents();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image file selected:', file.name, file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Image preview loaded');
        setImagePreview(e.target.result);
      };
      reader.onerror = () => {
        setError('Failed to load image preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      console.log('No image file to upload');
      return '';
    }
    
    try {
      console.log('Starting image upload...');
      setUploadProgress('Uploading image...');
      
      const timestamp = Date.now();
      const fileName = `${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const imageRef = ref(storage, `event-images/${fileName}`);
      
      console.log('Uploading to:', `event-images/${fileName}`);
      await uploadBytes(imageRef, imageFile);
      
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded successfully:', downloadURL);
      
      setUploadProgress('');
      return downloadURL;
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadProgress('');
      throw new Error('Failed to upload image: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Event description is required');
      return;
    }
    if (!formData.date) {
      setError('Event date is required');
      return;
    }
    if (!formData.time) {
      setError('Event time is required');
      return;
    }
    if (!formData.location.trim()) {
      setError('Event location is required');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Creating event with data:', formData);
      
      let imageUrl = '';
      if (imageFile) {
        console.log('Uploading image...');
        imageUrl = await uploadImage();
        console.log('Image URL received:', imageUrl);
      }
      
      const eventData = {
        ...formData,
        imageUrl,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim()
      };
      
      console.log('Final event data:', eventData);
      
      const eventId = await createEvent(eventData);
      console.log('Event created with ID:', eventId);
      
      if (eventId) {
        navigate(`/event/${eventId}`);
      } else {
        throw new Error('Failed to create event - no ID returned');
      }
    } catch (error) {
      console.error('Event creation failed:', error);
      setError(error.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create New Event</h1>
          <p className="card-subtitle">Bring people together with an amazing event</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {uploadProgress && <div className="alert alert-info">{uploadProgress}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Choose an image to represent your event (max 5MB)
            </p>
            {imagePreview && (
              <div style={{ marginTop: '1rem' }}>
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0'
                  }} 
                />
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  Image preview - this will be your event's main image
                </p>
              </div>
            )}
          </div>

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

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where will your event take place?"
              required
            />
          </div>

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
              {loading ? (uploadProgress || 'Creating Event...') : 'Create Event'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
