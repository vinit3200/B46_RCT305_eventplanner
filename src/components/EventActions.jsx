
import React from 'react';
import { Link } from 'react-router-dom';

const EventActions = ({ eventId, onDelete }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link to={`/edit-event/${eventId}`} className="btn btn-secondary">
        Edit
      </Link>
      <button className="btn btn-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default EventActions;
