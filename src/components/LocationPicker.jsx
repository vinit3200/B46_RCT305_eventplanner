
import React, { useState } from 'react';

const LocationPicker = ({ onLocationSelect, initialLocation = '' }) => {
  const [location, setLocation] = useState(initialLocation);

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
    onLocationSelect({ address: e.target.value, coordinates: null });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Use reverse geocoding with a free service (nominatim)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name || `${coords.lat}, ${coords.lng}`;
              setLocation(address);
              onLocationSelect({ address, coordinates: coords });
            })
            .catch(() => {
              // Fallback to coordinates if reverse geocoding fails
              const address = `${coords.lat}, ${coords.lng}`;
              setLocation(address);
              onLocationSelect({ address, coordinates: coords });
            });
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please enter the address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">Location *</label>
      
      <input
        type="text"
        className="form-input"
        value={location}
        onChange={handleLocationInput}
        placeholder="Enter event location"
        required
      />
      
      <div style={{ marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={getCurrentLocation}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          📱 Use Current Location
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
