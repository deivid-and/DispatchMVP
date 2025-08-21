import React from 'react';
import { formatCurrency, formatMiles, formatRPM } from '../../lib/fmt';
import { formatDisplayDate } from '../../lib/date';
import { DayCell } from './DayCell';
import { computeDriverStats } from './utils/computeStats';
import type { Driver, Load, WeekDay, DateRange } from '../../types/domain';

interface DriverRowProps {
  driver: Driver;
  loads: Load[];
  weekDays: WeekDay[];
  dateRange: DateRange;
  onDriverClick: (e: React.MouseEvent, driver: Driver) => void;
  onLoadClick: (e: React.MouseEvent, load: Load) => void;
  rowIndex: number;
}

export function DriverRow({ 
  driver, 
  loads, 
  weekDays, 
  dateRange, 
  onDriverClick, 
  onLoadClick, 
  rowIndex 
}: DriverRowProps) {
  const stats = computeDriverStats(loads);
  
  return (
    <tr className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap align-top">
        <div>
          <button
            className="text-blue-700 underline hover:text-blue-900 font-semibold focus:outline-none"
            onClick={(e) => onDriverClick(e, driver)}
            type="button"
          >
            {driver.name}
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
          <span>Gross: <span className="font-semibold text-blue-600">{formatCurrency(stats.gross)}</span></span>
          <span>Miles: <span className="font-semibold text-blue-600">{formatMiles(stats.miles)}</span></span>
          <span>RPM: <span className="font-semibold text-blue-600">{formatRPM(stats.avgRpm)}</span></span>
        </div>
      </td>
      {weekDays.map((day) => {
        const dayIso = dateRange.iso[day.idx];
        const dayLoads = loads.filter(l => l.delivery_date === dayIso);
        return (
          <DayCell 
            key={day.label} 
            loads={dayLoads} 
            onLoadClick={onLoadClick} 
          />
        );
      })}
    </tr>
  );
}
