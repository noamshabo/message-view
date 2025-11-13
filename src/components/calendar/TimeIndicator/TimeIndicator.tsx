/**
 * סמן זמן נוכחי - קו שמראה את השעה הנוכחית ביומן
 */

'use client';

import { useTimeIndicator } from '@/hooks/useTimeIndicator';
import { formatTime } from '@/lib/utils/dateUtils';
import './TimeIndicator.css';

export function TimeIndicator() {
  const { currentTimePercentage, currentTime } = useTimeIndicator();

  return (
    <div
      className="time-indicator"
      style={{ top: `${currentTimePercentage}%` }}
    >
      <div className="time-indicator-dot" />
      <div className="time-indicator-line" />
      <div className="time-indicator-label">
        {formatTime(currentTime)}
      </div>
    </div>
  );
}

