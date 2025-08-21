import React from 'react';
import { LoadChip } from './LoadChip';
import type { Load } from '../../types/domain';

interface DayCellProps {
  loads: Load[];
  onLoadClick: (e: React.MouseEvent, load: Load) => void;
}

export function DayCell({ loads, onLoadClick }: DayCellProps) {
  if (loads.length === 0) {
    return <td className="px-2 py-2 text-center text-gray-300">—</td>;
  }
  
  // For MVP, just show the first load if multiple
  const load = loads[0];
  
  return (
    <td className="px-2 py-2 text-center">
      <LoadChip load={load} onClick={onLoadClick} />
    </td>
  );
}
