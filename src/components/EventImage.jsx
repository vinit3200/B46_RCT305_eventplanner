
import React, { useState } from 'react';

const EventImage = ({ imageUrl, title }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('Failed to load event image:', imageUrl);
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="event-image" style={{ height: '300px', marginBottom: '2rem', overflow: 'hidden', position: 'relative' }}>
      {imageUrl && !imageError ? (
        <>
          {imageLoading && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              Loading image...
            </div>
          )}
          <img 
            src={imageUrl} 
            alt={title}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              display: imageLoading ? 'none' : 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </>
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
  );
};

export default EventImage;
