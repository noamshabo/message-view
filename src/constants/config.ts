/**
 * הגדרות כלליות למערכת היומן
 */

export const CALENDAR_CONFIG = {
  // הגדרות לוקאל
  locale: 'he-IL',
  direction: 'rtl' as const,
  timeZone: 'Asia/Jerusalem',
  
  // הגדרות תצוגה
  defaultView: 'week' as const,
  firstDayOfWeek: 0, // ראשון
  
  // הגדרות אנימציה
  animationDuration: 300, // ms
  transitionTiming: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // הגדרות API
  apiBaseUrl: '/api/calendar',
  apiTimeout: 10000, // 10 seconds
  
  // הגדרות סנכרון
  syncInterval: 300000, // 5 דקות
  autoSync: false, // בינתיים כבוי
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

