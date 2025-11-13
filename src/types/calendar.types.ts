/**
 * טיפוסי יומן
 */

export type CalendarView = 'week' | 'day' | 'month';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = ראשון, 6 = שבת

export interface WeekRange {
  start: Date;
  end: Date;
}

export interface DayInfo {
  date: Date;
  dayOfWeek: WeekDay;
  isToday: boolean;
  dayName: string;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

