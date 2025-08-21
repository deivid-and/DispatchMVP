import React from 'react';

interface PopoverProps {
  children: React.ReactNode;
  x: number;
  y: number;
  onClose: () => void;
  className?: string;
}

export function Popover({ children, x, y, onClose, className = '' }: PopoverProps) {
  return (
    <div
      className={`fixed z-50 bg-white border border-gray-300 rounded shadow-lg p-4 text-xs max-w-xs ${className}`}
      style={{ left: x, top: y }}
      onMouseLeave={onClose}
    >
      {children}
    </div>
  );
}
