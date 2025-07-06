
import React from 'react';
import { Link } from 'react-router-dom';

const EventHeader = ({ event, isEventCreator, onDeleteEvent }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
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
      
      {isEventCreator && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/edit-event/${event.id}`} className="btn btn-secondary">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={onDeleteEvent}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventHeader;
