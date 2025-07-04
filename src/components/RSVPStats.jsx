
import React from 'react';

const RSVPStats = ({ rsvps }) => {
  return (
    <div className="rsvp-stats">
      <div className="rsvp-stat">
        <div className="rsvp-count">{rsvps.attending.length}</div>
        <div className="rsvp-label">Attending</div>
      </div>
      <div className="rsvp-stat">
        <div className="rsvp-count">{rsvps.maybe.length}</div>
        <div className="rsvp-label">Maybe</div>
      </div>
      <div className="rsvp-stat">
        <div className="rsvp-count">{rsvps.declined.length}</div>
        <div className="rsvp-label">Declined</div>
      </div>
    </div>
  );
};

export default RSVPStats;
