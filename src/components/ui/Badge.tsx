import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <div className={`bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
