/**
 * Custom Hook ראשי לניהול היומן
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentWeekRange, getNextWeek, getPreviousWeek } from '@/lib/utils/dateUtils';
import type { CalendarEvent, WeekRange } from '@/types';

export function useCalendar() {
  const [weekRange, setWeekRange] = useState<WeekRange>(getCurrentWeekRange());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // טעינת אירועים מה-API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        start: weekRange.start.toISOString(),
        end: weekRange.end.toISOString(),
      });
      
      const response = await fetch(`/api/calendar/events?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      // המרת תאריכים חזרה ל-Date objects
      const parsedEvents = data.events.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      
      setEvents(parsedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [weekRange]);

  // טעינה אוטומטית כשהשבוע משתנה
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // מעבר לשבוע הבא
  const goToNextWeek = useCallback(() => {
    setWeekRange(prev => ({
      start: getNextWeek(prev.start),
      end: getNextWeek(prev.end),
    }));
  }, []);

  // מעבר לשבוע הקודם
  const goToPreviousWeek = useCallback(() => {
    setWeekRange(prev => ({
      start: getPreviousWeek(prev.start),
      end: getPreviousWeek(prev.end),
    }));
  }, []);

  // קפיצה להיום
  const goToToday = useCallback(() => {
    setWeekRange(getCurrentWeekRange());
  }, []);

  return {
    weekRange,
    events,
    isLoading,
    error,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    refetch: fetchEvents,
  };
}

