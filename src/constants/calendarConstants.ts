/**
 * קבועים ליומן
 */

// ימי השבוע בעברית
export const HEBREW_DAY_NAMES = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת',
] as const;

export const HEBREW_DAY_NAMES_SHORT = [
  'א׳',
  'ב׳',
  'ג׳',
  'ד׳',
  'ה׳',
  'ו׳',
  'ש׳',
] as const;

// חודשים בעברית
export const HEBREW_MONTH_NAMES = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
] as const;

// שעות עבודה ברירת מחדל
export const DEFAULT_WORK_HOURS = {
  start: 8, // 08:00
  end: 18, // 18:00
} as const;

// מרווחי זמן (בדקות)
export const TIME_SLOT_DURATION = 30; // 30 דקות
export const MIN_EVENT_DURATION = 15; // 15 דקות מינימום

// עדכון סמן זמן נוכחי (במילישניות)
export const TIME_INDICATOR_UPDATE_INTERVAL = 60000; // כל דקה

// תצוגות זמינות
export const CALENDAR_VIEWS = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month',
} as const;

// הגדרות גרירה
export const DRAG_DROP_CONFIG = {
  SNAP_MINUTES: 15, // התאמה לכל 15 דקות
  MIN_DURATION_MINUTES: 15,
  MAX_DURATION_HOURS: 8,
} as const;

