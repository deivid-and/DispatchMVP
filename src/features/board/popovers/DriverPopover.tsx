import React from 'react';
import { Popover } from '../../../components/ui/Popover';
import type { Driver } from '../../../types/domain';

interface DriverPopoverProps {
  driver: Driver;
  x: number;
  y: number;
  onClose: () => void;
  onCopy: (driver: Driver) => void;
}

export function DriverPopover({ driver, x, y, onClose, onCopy }: DriverPopoverProps) {
  return (
    <Popover x={x} y={y} onClose={onClose}>
      <div className="mb-2 text-base font-bold text-blue-700">Driver Info</div>
      <div className="mb-1"><span className="font-bold">Name:</span> {driver.name}</div>
      <div className="mb-1"><span className="font-bold">Truck#:</span> {driver.truck_number}</div>
      <div className="mb-1"><span className="font-bold">Trailer#:</span> {driver.trailer_number}</div>
      <div className="mb-1"><span className="font-bold">Trailer Type:</span> {driver.trailer_type}</div>
      <div className="mb-1"><span className="font-bold">Contact:</span> {driver.phone}</div>
      <div className="mb-2"><span className="font-bold">Notes:</span> {driver.notes}</div>
      <button
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded text-xs"
        onClick={() => onCopy(driver)}
        type="button"
      >
        Copy driver info
      </button>
    </Popover>
  );
}
