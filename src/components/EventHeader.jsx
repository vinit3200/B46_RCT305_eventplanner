
import React from 'react';

const EventHeader = ({ event }) => {
  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        {event.title}
      </h1>
      <div className="event-meta" style={{ fontSize: '1.1rem', gap: '2rem' }}>
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        <span>🕒 {event.time}</span>
        <span>📍 {event.location}</span>
        <span>🏷️ {event.category}</span>
      </div>
    </div>
  );
};

export default EventHeader;
