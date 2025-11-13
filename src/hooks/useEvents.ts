/**
 * Custom Hook לניהול אירועים (CRUD)
 */

'use client';

import { useCallback, useState } from 'react';
import type { CalendarEvent, CreateEventInput, UpdateEventInput } from '@/types';

export function useEvents() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * יצירת אירוע חדש
   */
  const createEvent = useCallback(async (eventData: CreateEventInput): Promise<CalendarEvent | null> => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }
      
      const data = await response.json();
      
      // המרת תאריכים
      const newEvent = {
        ...data.event,
        start: new Date(data.event.start),
        end: new Date(data.event.end),
      };
      
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating event:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * עדכון אירוע קיים
   */
  const updateEvent = useCallback(async (updates: UpdateEventInput): Promise<CalendarEvent | null> => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }
      
      const data = await response.json();
      
      // המרת תאריכים
      const updatedEvent = {
        ...data.event,
        start: new Date(data.event.start),
        end: new Date(data.event.end),
      };
      
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating event:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * מחיקת אירוע
   */
  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/calendar/events?id=${eventId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete event');
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting event:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    isSaving,
    error,
  };
}

