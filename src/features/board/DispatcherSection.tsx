import React from 'react';
import { Card, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui';
import { formatCurrency, formatMiles, formatRPM } from '../../lib/fmt';
import { formatDisplayDate } from '../../lib/date';
import { DriverRow } from './DriverRow';
import { getDriversForDispatcher, getLoadsForDriverInRange, getLoadsForDispatcherInRange } from '../../lib/selectors';
import { computeDispatcherStats } from './utils/computeStats';
import type { Dispatcher, Driver, Load, WeekDay, DateRange } from '../../types/domain';

interface DispatcherSectionProps {
  dispatcher: Dispatcher;
  drivers: Driver[];
  loads: Load[];
  weekDays: WeekDay[];
  dateRange: DateRange;
  companyId: string;
  onDriverClick: (e: React.MouseEvent, driver: Driver) => void;
  onLoadClick: (e: React.MouseEvent, load: Load) => void;
}

export function DispatcherSection({ 
  dispatcher, 
  drivers, 
  loads, 
  weekDays, 
  dateRange, 
  companyId,
  onDriverClick, 
  onLoadClick 
}: DispatcherSectionProps) {
  const dispatcherDrivers = getDriversForDispatcher(drivers, dispatcher.id);
  const dispatcherLoads = getLoadsForDispatcherInRange(loads, drivers, dispatcher.id, dateRange.iso, companyId);
  const stats = computeDispatcherStats(dispatcherLoads);

  return (
    <Card className="space-y-10">
      {/* Dispatcher Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">{dispatcher.name}</h2>
          <span className="text-xs text-gray-400">Dispatcher</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
          <Badge>
            Weekly Gross: <span className="font-semibold text-blue-600">{formatCurrency(stats.gross)}</span>
          </Badge>
          <Badge>
            Avg RPM: <span className="font-semibold text-blue-600">{formatRPM(stats.avgRpm)}</span>
          </Badge>
          <Badge>
            Loads: <span className="font-semibold text-blue-600">{stats.totalLoads}</span>
          </Badge>
          <Badge>
            Total Miles: <span className="font-semibold text-blue-600">{formatMiles(stats.miles)}</span>
          </Badge>
        </div>
      </div>
      
      {/* Drivers Calendar Grid */}
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100 text-gray-700">
              <TableHeader className="px-4 py-3 text-left font-semibold w-40">Driver</TableHeader>
              {weekDays.map((day) => (
                <TableHeader key={day.label} className="px-3 py-3 text-center font-semibold w-32">
                  <div>{day.label}</div>
                  <div className="text-xs text-gray-400">{formatDisplayDate(dateRange.iso[day.idx])}</div>
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dispatcherDrivers.map((driver, idx) => {
              const driverLoads = getLoadsForDriverInRange(loads, driver.id, dateRange.iso, companyId);
              return (
                <DriverRow
                  key={driver.id}
                  driver={driver}
                  loads={driverLoads}
                  weekDays={weekDays}
                  dateRange={dateRange}
                  onDriverClick={onDriverClick}
                  onLoadClick={onLoadClick}
                  rowIndex={idx}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
