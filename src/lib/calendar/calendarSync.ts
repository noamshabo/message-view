/**
 * לוגיקת סנכרון בין Outlook למערכת המקומית
 */

import type { CalendarEvent, OutlookSyncResult } from '@/types';
import { getOutlookEvents, createOutlookEvent, updateOutlookEvent, deleteOutlookEvent } from './outlookClient';
import { getAllEvents, setEvents, createEvent, updateEvent, deleteEvent } from './eventStorage';

/**
 * סנכרון מלא - משוך אירועים מ-Outlook ועדכן את המערכת המקומית
 */
export async function fullSync(startDate: Date, endDate: Date): Promise<OutlookSyncResult> {
  try {
    console.log('🔄 Starting full sync...');
    
    // משיכת אירועים מ-Outlook
    const outlookEvents = await getOutlookEvents(startDate, endDate);
    
    // עדכון המערכת המקומית
    setEvents(outlookEvents);
    
    console.log('✅ Sync completed successfully');
    
    return {
      success: true,
      eventsAdded: outlookEvents.length,
      eventsUpdated: 0,
      eventsDeleted: 0,
    };
  } catch (error) {
    console.error('❌ Sync failed:', error);
    
    return {
      success: false,
      eventsAdded: 0,
      eventsUpdated: 0,
      eventsDeleted: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * סנכרון אירוע בודד ל-Outlook
 */
export async function syncEventToOutlook(event: CalendarEvent): Promise<boolean> {
  try {
    if (event.outlookId) {
      // אירוע קיים - עדכון
      await updateOutlookEvent(event.outlookId, event);
    } else {
      // אירוע חדש - יצירה
      const { id, outlookId, ...eventData } = event;
      await createOutlookEvent(eventData);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync event to Outlook:', error);
    return false;
  }
}

/**
 * מחיקת אירוע מ-Outlook
 */
export async function deleteEventFromOutlook(eventId: string): Promise<boolean> {
  try {
    await deleteOutlookEvent(eventId);
    return true;
  } catch (error) {
    console.error('Failed to delete event from Outlook:', error);
    return false;
  }
}

