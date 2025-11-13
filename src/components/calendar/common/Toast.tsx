/**
 * הודעות קופצות (Toast Notifications)
 */

'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-amber-500 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        px-6 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        animate-in fade-in slide-in-from-top-5 duration-300
        ${typeStyles[type]}
      `}
      role="alert"
    >
      <span className="text-xl">{icons[type]}</span>
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="mr-2 hover:opacity-80"
        aria-label="סגור"
      >
        ✕
      </button>
    </div>
  );
}

