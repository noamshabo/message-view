/**
 * שמירה מקומית של אירועים - בינתיים בזיכרון, אפשר להרחיב ל-localStorage
 */

import type { CalendarEvent, CreateEventInput, UpdateEventInput } from '@/types';

// אחסון בזיכרון
let eventsStore: CalendarEvent[] = [];

/**
 * קבלת כל האירועים
 */
export function getAllEvents(): CalendarEvent[] {
  return [...eventsStore];
}

/**
 * קבלת אירועים לפי טווח תאריכים
 */
export function getEventsByDateRange(startDate: Date, endDate: Date): CalendarEvent[] {
  return eventsStore.filter(event => {
    return event.start >= startDate && event.start <= endDate;
  });
}

/**
 * קבלת אירוע לפי ID
 */
export function getEventById(id: string): CalendarEvent | undefined {
  return eventsStore.find(event => event.id === id);
}

/**
 * יצירת אירוע חדש
 */
export function createEvent(input: CreateEventInput): CalendarEvent {
  const newEvent: CalendarEvent = {
    ...input,
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  eventsStore.push(newEvent);
  return newEvent;
}

/**
 * עדכון אירוע קיים
 */
export function updateEvent(input: UpdateEventInput): CalendarEvent | null {
  const index = eventsStore.findIndex(event => event.id === input.id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedEvent = {
    ...eventsStore[index],
    ...input,
  };
  
  eventsStore[index] = updatedEvent;
  return updatedEvent;
}

/**
 * מחיקת אירוע
 */
export function deleteEvent(id: string): boolean {
  const index = eventsStore.findIndex(event => event.id === id);
  
  if (index === -1) {
    return false;
  }
  
  eventsStore.splice(index, 1);
  return true;
}

/**
 * איפוס כל האירועים
 */
export function clearAllEvents(): void {
  eventsStore = [];
}

/**
 * הגדרת אירועים (שימושי לטעינה מ-API)
 */
export function setEvents(events: CalendarEvent[]): void {
  eventsStore = [...events];
}

