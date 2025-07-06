
import React, { useState, useRef, useEffect } from 'react';

const LocationPicker = ({ onLocationSelect, initialLocation = '' }) => {
  const [location, setLocation] = useState(initialLocation);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  // You can set your Google Maps API key here
  // For production, consider using environment variables or user input
  const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_GOOGLE_MAPS_API_KEY';

  useEffect(() => {
    if (isMapVisible && window.google) {
      initializeMap();
      initializeAutocomplete();
    }
  }, [isMapVisible]);

  const initializeMap = () => {
    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    const marker = new window.google.maps.Marker({
      position: defaultCenter,
      map: map,
      draggable: true,
      title: 'Event Location',
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

  const initializeAutocomplete = () => {
    if (!searchInputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
      types: ['establishment', 'geocode'],
      fields: ['place_id', 'geometry', 'formatted_address', 'name']
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const coords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        const address = place.formatted_address || place.name;
        setLocation(address);
        setSelectedCoords(coords);
        onLocationSelect({ address, coordinates: coords });

        // Update marker position if map is visible
        if (markerRef.current) {
          markerRef.current.setPosition(coords);
          // Center map on new location
          if (mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current);
            map.setCenter(coords);
            map.setZoom(15);
          }
        }
      }
    });
  };

  const loadGoogleMaps = () => {
    if (GOOGLE_MAPS_API_KEY === 'YOUR_ACTUAL_GOOGLE_MAPS_API_KEY') {
      setApiKeyError(true);
      return;
    }

    if (window.google) {
      setIsMapVisible(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.onload = () => {
      setIsMapVisible(true);
      setApiKeyError(false);
    };
    script.onerror = () => {
      setApiKeyError(true);
    };
    document.head.appendChild(script);
  };

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
          
          setSelectedCoords(coords);
          
          // Reverse geocoding to get address
          if (window.google) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: coords }, (results, status) => {
              if (status === 'OK' && results[0]) {
                const address = results[0].formatted_address;
                setLocation(address);
                onLocationSelect({ address, coordinates: coords });
                
                // Update marker if map is visible
                if (markerRef.current) {
                  markerRef.current.setPosition(coords);
                }
              }
            });
          }
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
      
      {apiKeyError && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px',
          marginBottom: '1rem',
          color: '#856404'
        }}>
          <p><strong>Google Maps API Key Required</strong></p>
          <p>To use the map feature, you need to:</p>
          <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Enable the Maps JavaScript API and Places API</li>
            <li>Replace 'YOUR_ACTUAL_GOOGLE_MAPS_API_KEY' in the LocationPicker component</li>
          </ol>
        </div>
      )}

      <input
        type="text"
        className="form-input"
        value={location}
        onChange={handleLocationInput}
        placeholder="Enter event location"
        required
      />
      
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadGoogleMaps}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          📍 Select on Map
        </button>
        
        <button
          type="button"
          className="btn btn-secondary"
          onClick={getCurrentLocation}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          📱 Use Current Location
        </button>
      </div>

      {isMapVisible && !apiKeyError && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for a place..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div 
            ref={mapRef} 
            style={{ 
              height: '400px', 
              width: '100%', 
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            🔍 Search for a place above, click on the map, or drag the marker to select a location
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
