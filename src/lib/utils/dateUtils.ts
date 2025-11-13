/**
 * פונקציות עזר לעבודה עם תאריכים
 */

import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
} from 'date-fns';
import { he } from 'date-fns/locale';
import { HEBREW_DAY_NAMES, HEBREW_MONTH_NAMES } from '@/constants/calendarConstants';
import type { WeekRange, DayInfo, WeekDay } from '@/types';

/**
 * מחזיר את טווח השבוע הנוכחי
 */
export function getCurrentWeekRange(): WeekRange {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 0 }), // ראשון
    end: endOfWeek(now, { weekStartsOn: 0 }),
  };
}

/**
 * מחזיר את טווח השבוע לתאריך מסוים
 */
export function getWeekRange(date: Date): WeekRange {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  };
}

/**
 * מחזיר מערך של 7 ימים בשבוע
 */
export function getWeekDays(weekStart: Date): DayInfo[] {
  const days: DayInfo[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    days.push({
      date,
      dayOfWeek: i as WeekDay,
      isToday: isToday(date),
      dayName: HEBREW_DAY_NAMES[i],
    });
  }
  
  return days;
}

/**
 * מעבר לשבוע הבא
 */
export function getNextWeek(currentWeekStart: Date): Date {
  return addWeeks(currentWeekStart, 1);
}

/**
 * מעבר לשבוע הקודם
 */
export function getPreviousWeek(currentWeekStart: Date): Date {
  return subWeeks(currentWeekStart, 1);
}

/**
 * פורמט תאריך לעברית
 */
export function formatDateHebrew(date: Date, formatString: string = 'PPP'): string {
  return format(date, formatString, { locale: he });
}

/**
 * פורמט תאריך לכותרת שבוע (למשל: "15-21 נובמבר 2024")
 */
export function formatWeekTitle(weekStart: Date): string {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
  const startDay = format(weekStart, 'd');
  const endDay = format(weekEnd, 'd');
  const month = HEBREW_MONTH_NAMES[weekStart.getMonth()];
  const year = format(weekStart, 'yyyy');
  
  return `${startDay}-${endDay} ${month} ${year}`;
}

/**
 * פורמט שעה (למשל: "14:30")
 */
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

/**
 * פורמט טווח זמן (למשל: "14:30-16:00")
 */
export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)}-${formatTime(end)}`;
}

/**
 * בודק אם שני תאריכים באותו היום
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * יוצר תאריך עם שעה מסוימת
 */
export function createDateWithTime(date: Date, hours: number, minutes: number = 0): Date {
  let result = setHours(date, hours);
  result = setMinutes(result, minutes);
  return result;
}

/**
 * מחזיר את תחילת היום
 */
export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

/**
 * מחזיר את סוף היום
 */
export function getEndOfDay(date: Date): Date {
  return endOfDay(date);
}

/**
 * מחשב משך בדקות בין שני תאריכים
 */
export function getDurationInMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * מחזיר את השעה הנוכחית כאחוז מהיום (לסמן זמן נוכחי)
 */
export function getCurrentTimePercentage(): number {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  return (totalMinutes / (24 * 60)) * 100;
}

