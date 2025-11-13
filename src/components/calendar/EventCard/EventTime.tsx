/**
 * תצוגת זמן אירוע
 */

'use client';

import { formatTime } from '@/lib/utils/dateUtils';

interface EventTimeProps {
  start: Date;
  end: Date;
}

export function EventTime({ start, end }: EventTimeProps) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <span>🕐</span>
      <span>{formatTime(start)}</span>
      <span>-</span>
      <span>{formatTime(end)}</span>
    </div>
  );
}

