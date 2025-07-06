
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';
import { useRSVPReminders } from '../hooks/useRSVPReminders';
import EventComments from '../components/EventComments';
import EventHeader from '../components/EventHeader';
import EventImage from '../components/EventImage';
import SocialShare from '../components/SocialShare';
import RSVPSection from '../components/RSVPSection';
import RSVPStats from '../components/RSVPStats';
import EventDetailsInfo from '../components/EventDetailsInfo';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { events, rsvpToEvent, deleteEvent } = useEvents();
  const { requestNotificationPermission } = useRSVPReminders();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userRsvp, setUserRsvp] = useState(null);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === id);
    setEvent(foundEvent);
    
    if (foundEvent && currentUser) {
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
      
      // Request notification permission when user RSVPs
      if (status === 'attending') {
        await requestNotificationPermission();
      }
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
      <div className="card">
        <EventImage event={event} />
        
        <EventHeader 
          event={event} 
          isEventCreator={isEventCreator} 
          onDeleteEvent={handleDeleteEvent} 
        />

        <SocialShare 
          event={event} 
          isEventCreator={isEventCreator} 
        />

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

        <RSVPStats event={event} />
      </div>

      <EventDetailsInfo event={event} />

      <EventComments eventId={id} />
    </div>
  );
};

export default EventDetails;
