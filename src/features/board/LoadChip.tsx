import React from 'react';
import { getStatusStyles } from './utils/statusStyles';
import type { Load } from '../../types/domain';

interface LoadChipProps {
  load: Load;
  onClick: (e: React.MouseEvent, load: Load) => void;
}

export function LoadChip({ load, onClick }: LoadChipProps) {
  const { container, bar } = getStatusStyles(load.status);
  
  return (
    <div
      className={`relative mx-auto rounded border text-xs px-2 py-1 font-semibold w-full max-w-[110px] truncate bg-white ${container}`}
      onClick={(e) => onClick(e, load)}
      style={{ cursor: 'pointer' }}
    >
      <span className="block text-gray-800 font-medium">{load.delivery_city}, {load.delivery_state}</span>
      {/* Status badge as a small colored bar at the bottom */}
      <span className={`absolute left-0 bottom-0 w-full h-1 rounded-b ${bar}`} />
    </div>
  );
}
