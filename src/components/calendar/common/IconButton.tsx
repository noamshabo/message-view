/**
 * כפתור עם אייקון
 */

'use client';

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ 
  icon, 
  label, 
  size = 'md', 
  className = '', 
  ...props 
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };
  
  const classes = `
    inline-flex items-center justify-center rounded-lg
    bg-transparent hover:bg-gray-100 active:bg-gray-200
    transition-all duration-200 active:scale-95
    ${sizeClasses[size]} ${className}
  `;
  
  return (
    <button 
      className={classes} 
      title={label}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}

