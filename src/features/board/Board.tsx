import React, { useEffect, useState } from "react";
import { getBoard, type BoardResponse } from "../../lib/api";
import { groupByDispatcherDriverDay } from "../../lib/selectors";

export function Board() {
  const [data, setData] = useState<BoardResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // seed range for quick verification
    getBoard("2025-07-20", "2025-07-23")
      .then(setData)
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="text-red-600">Error: {err}</div>;
  if (!data) return <div>Loading board…</div>;
  
  const grouped = groupByDispatcherDriverDay(data.loads);
  
  return (
    <div>
      <div className="mb-2 text-sm text-gray-600">Range: {data.range.start} → {data.range.end}</div>
      <div className="text-lg font-semibold">Loads: {data.count}</div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Totals:</h3>
        <div className="text-sm">
          <div>Gross: ${grouped.totals.gross.toLocaleString()}</div>
          <div>Miles: {grouped.totals.miles.toLocaleString()}</div>
          <div>Avg RPM: ${grouped.totals.avgRpm.toFixed(2)}</div>
          <div>Active Drivers: {grouped.totals.activeDrivers}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-semibold mb-2">By Dispatcher:</h3>
        {grouped.dispatchers.map(disp => (
          <div key={disp.id} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="font-medium">{disp.name}</div>
            <div className="text-sm text-gray-600">
              ${disp.gross.toLocaleString()} | {disp.miles}mi | ${disp.avgRpm.toFixed(2)} RPM | {disp.drivers.length} drivers
            </div>
          </div>
        ))}
      </div>
      
      <pre className="mt-3 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
        {JSON.stringify(grouped, null, 2)}
      </pre>
    </div>
  );
}
