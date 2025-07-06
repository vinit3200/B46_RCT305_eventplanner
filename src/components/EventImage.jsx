
import React from 'react';

const EventImage = ({ event }) => {
  return (
    <div className="event-image" style={{ height: '300px', marginBottom: '2rem' }}>
      {event?.imageUrl ? (
        <img 
          src={event.imageUrl} 
          alt={event.title || 'Event'} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '8px'
          }} 
        />
      ) : (
        <div style={{ 
          height: '100%', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '3rem',
          borderRadius: '8px'
        }}>
          🎉
        </div>
      )}
    </div>
  );
};

export default EventImage;
