/**
 * טיפוסי אירוע ליומן
 */

export type EventStatus = 'confirmed' | 'tentative' | 'cancelled';

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  attendees?: string[];
  color?: string;
  isAllDay?: boolean;
  outlookId?: string;
  status?: EventStatus;
};

export type CreateEventInput = Omit<CalendarEvent, 'id' | 'outlookId'>;

export type UpdateEventInput = Partial<CreateEventInput> & {
  id: string;
};

