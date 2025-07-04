
import React from 'react';

const EventDetailsInfo = ({ event }) => {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>Event Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <strong>Date & Time:</strong>
          <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
        </div>
        <div>
          <strong>Location:</strong>
          <p>{event.location}</p>
        </div>
        <div>
          <strong>Category:</strong>
          <p style={{ textTransform: 'capitalize' }}>{event.category}</p>
        </div>
        <div>
          <strong>Visibility:</strong>
          <p>{event.isPublic ? 'Public Event' : 'Private Event'}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsInfo;
