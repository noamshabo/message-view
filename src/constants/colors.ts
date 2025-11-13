/**
 * פלטת צבעים מודרנית ליומן - מבוססת על טרנדים 2024-2025
 */

export const EVENT_COLORS = {
  indigo: '#6366F1',
  emerald: '#10B981',
  amber: '#F59E0B',
  pink: '#EC4899',
  purple: '#8B5CF6',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  orange: '#F97316',
  teal: '#14B8A6',
} as const;

export const BACKGROUND_COLORS = {
  main: '#FAFBFC',
  card: '#FFFFFF',
  hover: '#F3F4F6',
  border: '#E5E7EB',
} as const;

export const TEXT_COLORS = {
  primary: '#1F2937',
  secondary: '#6B7280',
  light: '#9CA3AF',
  white: '#FFFFFF',
} as const;

export const SHADOW_STYLES = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export type EventColor = keyof typeof EVENT_COLORS;

// מערך של כל הצבעים הזמינים
export const AVAILABLE_COLORS = Object.entries(EVENT_COLORS).map(([name, value]) => ({
  name,
  value,
}));

