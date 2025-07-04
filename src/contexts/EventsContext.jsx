import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const EventsContext = createContext();

export const useEvents = () => {
  return useContext(EventsContext);
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const createEvent = async (eventData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to create an event');
    }
    
    console.log('Creating event in Firestore with data:', eventData);
    
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        attendees: [],
        rsvps: {
          attending: [],
          maybe: [],
          declined: []
        },
        comments: []
      });
      
      console.log('Event created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event in Firestore:', error);
      throw new Error('Failed to create event: ' + error.message);
    }
  };

  const updateEvent = async (eventId, updates) => {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, updates);
  };

  const deleteEvent = async (eventId) => {
    await deleteDoc(doc(db, 'events', eventId));
  };

  const rsvpToEvent = async (eventId, status) => {
    if (!currentUser) return;
    
    const eventRef = doc(db, 'events', eventId);
    const event = events.find(e => e.id === eventId);
    
    if (event) {
      // Remove user from all RSVP lists first
      const updatedRsvps = {
        attending: event.rsvps.attending.filter(uid => uid !== currentUser.uid),
        maybe: event.rsvps.maybe.filter(uid => uid !== currentUser.uid),
        declined: event.rsvps.declined.filter(uid => uid !== currentUser.uid)
      };
      
      // Add user to the appropriate list
      updatedRsvps[status].push(currentUser.uid);
      
      await updateDoc(eventRef, { rsvps: updatedRsvps });
    }
  };

  const getUserEvents = (userId) => {
    return events.filter(event => event.createdBy === userId);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events.filter(event => new Date(event.date) >= now);
  };

  const getPastEvents = () => {
    const now = new Date();
    return events.filter(event => new Date(event.date) < now);
  };

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      console.log('Events loaded from Firestore:', eventsData.length);
      setEvents(eventsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    getUserEvents,
    getUpcomingEvents,
    getPastEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
