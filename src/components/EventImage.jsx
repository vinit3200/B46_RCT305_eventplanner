
import React from 'react';

const EventImage = ({ imageUrl, title }) => {
  return (
    <div className="event-image" style={{ height: '300px', marginBottom: '2rem', overflow: 'hidden' }}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
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
  );
};

export default EventImage;
