import React from 'react';

interface StatProps {
  label: string;
  value: string | number;
  className?: string;
}

export function Stat({ label, value, className = '' }: StatProps) {
  return (
    <div className={`bg-white rounded shadow p-6 flex flex-col ${className}`}>
      <span className="text-sm text-gray-500 mb-1">{label}</span>
      <span className="text-2xl font-semibold text-blue-600">{value}</span>
    </div>
  );
}
