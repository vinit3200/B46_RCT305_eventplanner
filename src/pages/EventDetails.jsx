
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';
import EventImage from '../components/EventImage';
import EventHeader from '../components/EventHeader';
import EventActions from '../components/EventActions';
import SocialShare from '../components/SocialShare';
import RSVPSection from '../components/RSVPSection';
import RSVPStats from '../components/RSVPStats';
import EventDetailsInfo from '../components/EventDetailsInfo';
import EventComments from '../components/EventComments';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { events, rsvpToEvent, deleteEvent } = useEvents();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userRsvp, setUserRsvp] = useState(null);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === id);
    setEvent(foundEvent);
    
    if (foundEvent && currentUser) {
      // Find user's current RSVP status
      if (foundEvent.rsvps.attending.includes(currentUser.uid)) {
        setUserRsvp('attending');
      } else if (foundEvent.rsvps.maybe.includes(currentUser.uid)) {
        setUserRsvp('maybe');
      } else if (foundEvent.rsvps.declined.includes(currentUser.uid)) {
        setUserRsvp('declined');
      }
    }
  }, [id, events, currentUser]);

  const handleRsvp = async (status) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      await rsvpToEvent(id, status);
      setUserRsvp(status);
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        navigate('/events');
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  if (!event) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const isEventCreator = currentUser && event.createdBy === currentUser.uid;
  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="fade-in">
      <div className="card animate-scale-in">
        <EventImage imageUrl={event.imageUrl} title={event.title} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
          <EventHeader event={event} />
          
          {isEventCreator && (
            <EventActions eventId={id} onDelete={handleDeleteEvent} />
          )}
        </div>

        {/* Social Sharing Section - Show for private events or event creators */}
        {(!event.isPublic || isEventCreator) && (
          <SocialShare event={event} />
        )}

        <div className="card-header">
          <h2 className="card-title">About This Event</h2>
        </div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '2rem' }}>
          {event.description}
        </p>

        <RSVPSection 
          currentUser={currentUser}
          userRsvp={userRsvp}
          onRsvp={handleRsvp}
          isEventPast={isEventPast}
        />

        <RSVPStats rsvps={event.rsvps} />

        <EventComments eventId={id} />
      </div>

      <EventDetailsInfo event={event} />
    </div>
  );
};

export default EventDetails;
