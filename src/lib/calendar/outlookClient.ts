/**
 * Outlook Calendar Client - כולל Dummy Data ו-Placeholders לחיבור אמיתי
 */

import type { CalendarEvent, OutlookEvent, OutlookSyncResult } from '@/types';
import { EVENT_COLORS } from '@/constants/colors';

// ============================================================================
// DUMMY DATA - נתונים לדוגמה לפיתוח
// ============================================================================

const DUMMY_EVENTS: CalendarEvent[] = [
  {
    id: 'dummy-1',
    title: 'פגישת צוות שבועית',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    description: 'פגישה שבועית עם הצוות לעדכונים',
    location: 'חדר ישיבות A',
    attendees: ['יוסי כהן', 'רחל לוי', 'דוד אברהם'],
    color: 'indigo',
    status: 'confirmed',
  },
  {
    id: 'dummy-2',
    title: 'שיחת טלפון עם לקוח',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: 'דיון על פרויקט חדש',
    location: 'טלפון',
    attendees: ['משה ישראלי'],
    color: 'emerald',
    status: 'confirmed',
  },
  {
    id: 'dummy-3',
    title: 'הצגת מוצר ללקוח',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: 'הצגת המוצר החדש',
    location: 'משרדי הלקוח, תל אביב',
    attendees: ['שרה כהן', 'אבי לוי', 'מנהל הלקוח'],
    color: 'purple',
    status: 'tentative',
  },
  {
    id: 'dummy-4',
    title: 'ארוחת צהריים עם השותף העסקי',
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    description: 'דיון על אסטרטגיה',
    location: 'מסעדת בוסתן',
    attendees: ['אלי גרוס'],
    color: 'amber',
    status: 'confirmed',
  },
  {
    id: 'dummy-5',
    title: 'סדנת פיתוח מקצועי',
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    end: new Date(new Date().setDate(new Date().getDate() + 4)),
    description: 'למידה והתפתחות',
    location: 'מרכז הכשרה',
    attendees: ['כל הצוות'],
    color: 'pink',
    status: 'confirmed',
  },
];

// תיקון תאריכים של dummy events להיות בשעות מתאימות
DUMMY_EVENTS[1].start.setHours(14, 0, 0, 0);
DUMMY_EVENTS[1].end.setHours(15, 0, 0, 0);
DUMMY_EVENTS[2].start.setHours(9, 30, 0, 0);
DUMMY_EVENTS[2].end.setHours(11, 0, 0, 0);
DUMMY_EVENTS[3].start.setHours(12, 30, 0, 0);
DUMMY_EVENTS[3].end.setHours(14, 0, 0, 0);
DUMMY_EVENTS[4].start.setHours(15, 0, 0, 0);
DUMMY_EVENTS[4].end.setHours(17, 0, 0, 0);

// ============================================================================
// API FUNCTIONS - בינתיים עם Dummy Data
// ============================================================================

/**
 * משיכת אירועים מ-Outlook
 * כרגע מחזיר Dummy Data
 * 
 * TODO: כשתהיה מוכן, החלף ב-:
 * 1. קבל access token מ-NextAuth session
 * 2. השתמש ב-Microsoft Graph API
 * 3. המר OutlookEvent ל-CalendarEvent
 */
export async function getOutlookEvents(
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  console.log('📅 [Outlook Client] Fetching events (DUMMY DATA):', { startDate, endDate });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // מחזיר dummy events שבטווח התאריכים
  const filteredEvents = DUMMY_EVENTS.filter(event => {
    return event.start >= startDate && event.start <= endDate;
  });
  
  console.log(`📅 [Outlook Client] Found ${filteredEvents.length} events`);
  return filteredEvents;
  
  /* 
  // קוד אמיתי לעתיד:
  try {
    const session = await getSession();
    const accessToken = session?.accessToken;
    
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
    
    const result = await client
      .api('/me/calendar/events')
      .filter(`start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`)
      .select('subject,start,end,location,attendees,bodyPreview,isAllDay')
      .get();
    
    return result.value.map(convertOutlookEventToCalendarEvent);
  } catch (error) {
    console.error('Error fetching Outlook events:', error);
    throw error;
  }
  */
}

/**
 * יצירת אירוע חדש ב-Outlook
 * כרגע רק מדפיס ל-console
 */
export async function createOutlookEvent(
  event: Omit<CalendarEvent, 'id' | 'outlookId'>
): Promise<CalendarEvent> {
  console.log('📅 [Outlook Client] Creating event (DUMMY):', event);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newEvent: CalendarEvent = {
    ...event,
    id: `dummy-${Date.now()}`,
    outlookId: undefined, // אין outlookId כי זה dummy
  };
  
  console.log('✅ [Outlook Client] Event created (locally):', newEvent.id);
  return newEvent;
  
  /*
  // קוד אמיתי לעתיד:
  try {
    const session = await getSession();
    const client = getGraphClient(session.accessToken);
    
    const outlookEvent = convertCalendarEventToOutlook(event);
    const result = await client.api('/me/calendar/events').post(outlookEvent);
    
    return convertOutlookEventToCalendarEvent(result);
  } catch (error) {
    console.error('Error creating Outlook event:', error);
    throw error;
  }
  */
}

/**
 * עדכון אירוע קיים ב-Outlook
 */
export async function updateOutlookEvent(
  eventId: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  console.log('📅 [Outlook Client] Updating event (DUMMY):', eventId, updates);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // מוצא את האירוע ב-dummy data
  const existingEvent = DUMMY_EVENTS.find(e => e.id === eventId);
  if (!existingEvent) {
    throw new Error('Event not found');
  }
  
  const updatedEvent = { ...existingEvent, ...updates };
  console.log('✅ [Outlook Client] Event updated (locally):', eventId);
  
  return updatedEvent;
  
  /*
  // קוד אמיתי לעתיד:
  try {
    const session = await getSession();
    const client = getGraphClient(session.accessToken);
    
    const outlookUpdates = convertCalendarEventToOutlook(updates);
    const result = await client
      .api(`/me/calendar/events/${eventId}`)
      .patch(outlookUpdates);
    
    return convertOutlookEventToCalendarEvent(result);
  } catch (error) {
    console.error('Error updating Outlook event:', error);
    throw error;
  }
  */
}

/**
 * מחיקת אירוע מ-Outlook
 */
export async function deleteOutlookEvent(eventId: string): Promise<void> {
  console.log('📅 [Outlook Client] Deleting event (DUMMY):', eventId);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log('✅ [Outlook Client] Event deleted (locally):', eventId);
  
  /*
  // קוד אמיתי לעתיד:
  try {
    const session = await getSession();
    const client = getGraphClient(session.accessToken);
    
    await client.api(`/me/calendar/events/${eventId}`).delete();
  } catch (error) {
    console.error('Error deleting Outlook event:', error);
    throw error;
  }
  */
}

/**
 * סנכרון מלא עם Outlook
 */
export async function syncWithOutlook(
  startDate: Date,
  endDate: Date
): Promise<OutlookSyncResult> {
  console.log('📅 [Outlook Client] Syncing with Outlook (DUMMY)');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    eventsAdded: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
  };
  
  /*
  // קוד אמיתי לעתיד:
  // 1. משוך אירועים מ-Outlook
  // 2. משוך אירועים מהמערכת המקומית
  // 3. השווה וסנכרן
  // 4. החזר תוצאות
  */
}

// ============================================================================
// HELPER FUNCTIONS - לעתיד
// ============================================================================

/**
 * המרת OutlookEvent ל-CalendarEvent
 */
function convertOutlookEventToCalendarEvent(outlookEvent: OutlookEvent): CalendarEvent {
  return {
    id: outlookEvent.id || `outlook-${Date.now()}`,
    outlookId: outlookEvent.id,
    title: outlookEvent.subject,
    start: new Date(outlookEvent.start.dateTime),
    end: new Date(outlookEvent.end.dateTime),
    description: outlookEvent.bodyPreview,
    location: outlookEvent.location?.displayName,
    attendees: outlookEvent.attendees?.map(a => a.emailAddress.name) || [],
    isAllDay: outlookEvent.isAllDay,
    status: outlookEvent.showAs === 'tentative' ? 'tentative' : 'confirmed',
    color: 'indigo', // ברירת מחדל
  };
}

/**
 * המרת CalendarEvent ל-OutlookEvent
 */
function convertCalendarEventToOutlook(event: Partial<CalendarEvent>): Partial<OutlookEvent> {
  return {
    subject: event.title,
    start: event.start ? {
      dateTime: event.start.toISOString(),
      timeZone: 'Asia/Jerusalem',
    } : undefined,
    end: event.end ? {
      dateTime: event.end.toISOString(),
      timeZone: 'Asia/Jerusalem',
    } : undefined,
    location: event.location ? {
      displayName: event.location,
    } : undefined,
    isAllDay: event.isAllDay,
    bodyPreview: event.description,
  };
}

