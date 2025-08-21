import React from 'react';
import type { DateRange } from '../../types/domain';

interface PageHeaderProps {
  title: string;
  range?: DateRange;
  rangeIdx?: number;
  onRangeChange?: (idx: number) => void;
  maxRangeIdx?: number;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  range, 
  rangeIdx, 
  onRangeChange, 
  maxRangeIdx,
  children 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Date Range Selector */}
        {range && rangeIdx !== undefined && onRangeChange && maxRangeIdx !== undefined && (
          <div className="flex items-center">
            <button
              className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
              onClick={() => onRangeChange(Math.max(0, rangeIdx - 1))}
              disabled={rangeIdx === 0}
              aria-label="Previous week"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="mx-4 text-lg font-medium text-gray-700 tracking-wide select-none">
              {range.start} - {range.end}
            </span>
            {rangeIdx < maxRangeIdx ? (
              <button
                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                onClick={() => onRangeChange(Math.min(maxRangeIdx, rangeIdx + 1))}
                aria-label="Next week"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <span className="px-2 py-1 text-gray-300 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </div>
        )}
        
        {/* Additional page actions */}
        {children}
      </div>
    </div>
  );
} 