import { useEffect, useState, useRef } from 'react';
import { format, parse, addMinutes, differenceInMinutes } from 'date-fns';
import type { StudySession } from '@/types';
import { useNotifications } from './useNotifications';

interface SessionAlert {
  type: 'start' | 'end';
  session: StudySession;
}

export const useSessionAlerts = (sessions: StudySession[]) => {
  const [activeAlert, setActiveAlert] = useState<SessionAlert | null>(null);
  const { showNotification, playSound } = useNotifications();
  const notifiedSessions = useRef<Set<string>>(new Set());
  const completedSessions = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkSessionTimes = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const today = format(now, 'yyyy-MM-dd');

      sessions.forEach((session) => {
        if (session.date !== today) return;
        if (session.completed) return;

        const sessionKey = `${session.id}-${session.date}`;

        try {
          // Parse session times
          const startTime = parse(session.startTime, 'HH:mm', now);
          const endTime = parse(session.endTime, 'HH:mm', now);

          // Check for 2-minute warning before start
          const minutesUntilStart = differenceInMinutes(startTime, now);
          
          if (minutesUntilStart === 2 && !notifiedSessions.current.has(`${sessionKey}-start`)) {
            console.log('Session starting in 2 minutes:', session.subject);
            
            // Browser notification
            showNotification('Study Session Starting Soon!', {
              body: `${session.subject} - Chapter ${session.chapter}, Lecture ${session.lecture}\nStarts at ${session.startTime}`,
              tag: `session-start-${session.id}`,
              requireInteraction: false,
            });

            // Sound alert
            playSound('start');

            // Show modal
            setActiveAlert({ type: 'start', session });

            // Mark as notified
            notifiedSessions.current.add(`${sessionKey}-start`);
          }

          // Check for session end
          const minutesSinceEnd = differenceInMinutes(now, endTime);
          
          if (
            minutesSinceEnd >= 0 && 
            minutesSinceEnd < 1 && 
            !completedSessions.current.has(sessionKey) &&
            !notifiedSessions.current.has(`${sessionKey}-end`)
          ) {
            console.log('Session ended:', session.subject);
            
            // Browser notification
            showNotification('Study Session Complete!', {
              body: `${session.subject} - Time to mark as complete or extend?\nClick to respond.`,
              tag: `session-end-${session.id}`,
              requireInteraction: true,
            });

            // Sound alert
            playSound('end');

            // Show modal
            setActiveAlert({ type: 'end', session });

            // Mark as notified
            notifiedSessions.current.add(`${sessionKey}-end`);
          }
        } catch (error) {
          console.error('Error checking session times:', error);
        }
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkSessionTimes, 30000);
    
    // Initial check
    checkSessionTimes();

    return () => clearInterval(interval);
  }, [sessions, showNotification, playSound]);

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  const markSessionCompleted = (sessionId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    completedSessions.current.add(`${sessionId}-${today}`);
    setActiveAlert(null);
  };

  return {
    activeAlert,
    dismissAlert,
    markSessionCompleted,
  };
};
