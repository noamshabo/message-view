/**
 * פונקציות עזר לעבודה עם צבעים
 */

import { EVENT_COLORS, type EventColor } from '@/constants/colors';

/**
 * מחזיר צבע אירוע לפי שם
 */
export function getEventColor(colorName: string | undefined): string {
  if (!colorName || !(colorName in EVENT_COLORS)) {
    return EVENT_COLORS.indigo; // ברירת מחדל
  }
  return EVENT_COLORS[colorName as EventColor];
}

/**
 * המיר HEX ל-RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * יוצר צבע עם שקיפות
 */
export function addOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * בוחר צבע טקסט (שחור או לבן) בהתאם לבהירות הרקע
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  // חישוב בהירות יחסית
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  
  return brightness > 155 ? '#000000' : '#FFFFFF';
}

/**
 * מחזיר צבע רקע בהיר לאירוע
 */
export function getLightEventBackground(hex: string): string {
  return addOpacity(hex, 0.15);
}

/**
 * מחזיר צבע גבול לאירוע
 */
export function getEventBorderColor(hex: string): string {
  return addOpacity(hex, 0.5);
}

