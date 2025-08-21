import React from 'react';
import { Popover } from '../../../components/ui/Popover';
import { isoToDisplayDate } from '../../../lib/date';
import type { Load } from '../../../types/domain';

interface LoadPopoverProps {
  load: Load;
  x: number;
  y: number;
  onClose: () => void;
  onCopy: (load: Load) => void;
}

export function LoadPopover({ load, x, y, onClose, onCopy }: LoadPopoverProps) {
  return (
    <Popover x={x} y={y} onClose={onClose} className="min-w-[260px]">
      <div className="mb-2 text-xs font-bold text-blue-700">LOAD BOOKED UNDER JMJMN</div>
      <div className="mb-1 text-gray-700">West Motor Freight of PA (MC#021866)</div>
      <div className="mb-2">
        <span className="text-blue-600 underline font-bold">{`LOAD# ${load.load_number}`}</span>
      </div>
      <div className="border-t border-gray-200 my-2" />
      <div className="mb-1 font-bold">PU:</div>
      <div>{load.pickup_name}</div>
      <div>{load.pickup_address}</div>
      <div>{load.pickup_city}, {load.pickup_state} {load.pickup_zip}</div>
      <div>{isoToDisplayDate(load.pickup_date)} {load.pickup_time_window}</div>
      <div>Pick Up# {load.pickup_number}</div>
      <div className="border-t border-gray-200 my-2" />
      <div className="mb-1 font-bold">DEL:</div>
      <div>{load.delivery_address}</div>
      <div>{load.delivery_city}, {load.delivery_state} {load.delivery_zip}</div>
      <div>{isoToDisplayDate(load.delivery_date)} {load.delivery_time_window}</div>
      <div className="border-t border-gray-200 my-2" />
      <div className="mb-1 font-bold">${load.rate}</div>
      {load.attached_files && load.attached_files.length > 0 && (
        <div className="mt-2">
          <div className="font-bold mb-1">Attached Files:</div>
          <ul className="list-disc pl-4">
            {load.attached_files.map(f => (
              <li key={f} className="text-blue-700 underline cursor-pointer" onClick={() => alert(`Download ${f}`)}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded text-xs"
        onClick={() => onCopy(load)}
        type="button"
      >
        Copy load info
      </button>
    </Popover>
  );
}
