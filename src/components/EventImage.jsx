
import React from 'react';

const EventImage = () => {
  return (
    <div className="event-image" style={{ height: '300px', marginBottom: '2rem' }}>
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
    </div>
  );
};

export default EventImage;
