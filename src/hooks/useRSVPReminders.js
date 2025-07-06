
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

export const useRSVPReminders = () => {
  const { currentUser } = useAuth();
  const { events } = useEvents();

  const checkEventReminders = () => {
    if (!currentUser || !events.length) return;

    const now = new Date();
    const userEvents = events.filter(event => 
      event.rsvps.attending.includes(currentUser.uid)
    );

    userEvents.forEach(event => {
      const eventDate = new Date(`${event.date} ${event.time}`);
      const timeDiff = eventDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      // Show reminder 24 hours before
      if (daysDiff <= 1 && daysDiff > 0 && hoursDiff > 1) {
        showNotification(
          `Event Reminder: ${event.title}`,
          `Your event "${event.title}" is tomorrow at ${event.time}. Location: ${event.location}`,
          event.id
        );
      }

      // Show reminder 1 hour before
      if (hoursDiff <= 1 && hoursDiff > 0) {
        showNotification(
          `Event Starting Soon: ${event.title}`,
          `Your event "${event.title}" starts in less than an hour at ${event.location}`,
          event.id
        );
      }
    });
  };

  const showNotification = (title, body, eventId) => {
    // Check if notifications are supported and permitted
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body: body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `event-${eventId}`,
          requireInteraction: true
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = `/event/${eventId}`;
        };
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification(title, body, eventId);
          }
        });
      }
    }

    // Fallback: Show browser alert
    const showAlert = () => {
      if (window.confirm(`${title}\n\n${body}\n\nClick OK to view event details.`)) {
        window.location.href = `/event/${eventId}`;
      }
    };

    // Show alert after a short delay to avoid blocking
    setTimeout(showAlert, 1000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  useEffect(() => {
    // Request notification permission on first load
    requestNotificationPermission();

    // Check for reminders every 5 minutes
    const interval = setInterval(checkEventReminders, 5 * 60 * 1000);
    
    // Check immediately
    checkEventReminders();

    return () => clearInterval(interval);
  }, [currentUser, events]);

  return { requestNotificationPermission };
};
