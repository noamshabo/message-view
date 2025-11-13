/**
 * Custom Hook לסמן זמן נוכחי
 */

'use client';

import { useState, useEffect } from 'react';
import { getCurrentTimePercentage } from '@/lib/utils/dateUtils';
import { TIME_INDICATOR_UPDATE_INTERVAL } from '@/constants/calendarConstants';

export function useTimeIndicator() {
  const [currentTimePercentage, setCurrentTimePercentage] = useState(() => 
    getCurrentTimePercentage()
  );
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    // עדכון מיידי
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentTimePercentage(getCurrentTimePercentage());
    };

    updateTime();

    // עדכון כל דקה
    const interval = setInterval(updateTime, TIME_INDICATOR_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return {
    currentTimePercentage,
    currentTime,
    isToday: (date: Date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
  };
}

