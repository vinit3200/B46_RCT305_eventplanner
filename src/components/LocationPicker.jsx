
import React, { useState, useRef, useEffect } from 'react';

const LocationPicker = ({ onLocationSelect, initialLocation = '' }) => {
  const [location, setLocation] = useState(initialLocation);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (isMapVisible && window.google) {
      initializeMap();
    }
  }, [isMapVisible]);

  const initializeMap = () => {
    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: defaultCenter,
    });

    const marker = new window.google.maps.Marker({
      position: defaultCenter,
      map: map,
      draggable: true,
    });

    markerRef.current = marker;

    // Add click listener to map
    map.addListener('click', (event) => {
      const coords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      marker.setPosition(coords);
      setSelectedCoords(coords);
      
      // Reverse geocoding to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setLocation(address);
          onLocationSelect({ address, coordinates: coords });
        }
      });
    });

    // Add dragend listener to marker
    marker.addListener('dragend', (event) => {
      const coords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      setSelectedCoords(coords);
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setLocation(address);
          onLocationSelect({ address, coordinates: coords });
        }
      });
    });
  };

  const loadGoogleMaps = () => {
    if (window.google) {
      setIsMapVisible(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
    script.onload = () => {
      setIsMapVisible(true);
    };
    document.head.appendChild(script);
  };

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
    onLocationSelect({ address: e.target.value, coordinates: null });
  };

  return (
    <div className="form-group">
      <label className="form-label">Location *</label>
      <input
        type="text"
        className="form-input"
        value={location}
        onChange={handleLocationInput}
        placeholder="Enter event location or click 'Select on Map'"
        required
      />
      
      <div style={{ marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadGoogleMaps}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          📍 Select on Map
        </button>
      </div>

      {isMapVisible && (
        <div style={{ marginTop: '1rem' }}>
          <div 
            ref={mapRef} 
            style={{ 
              height: '300px', 
              width: '100%', 
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Click on the map or drag the marker to select a location
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
