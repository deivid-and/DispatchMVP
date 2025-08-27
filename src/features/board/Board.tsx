import React, { useEffect, useMemo, useState } from "react";
import { getBoard, type BoardResponse } from "../../lib/api";
import { groupByDispatcherDriverDay } from "../../lib/selectors";

export function Board({ refreshToken = 0 }: { refreshToken?: number }) {
  const [data, setData] = useState<BoardResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // MUST be called every render (fixes hook order)
  const grouped = useMemo(
    () => groupByDispatcherDriverDay(data?.loads ?? []),
    [data?.loads]
  );

  useEffect(() => {
    let ignore = false;
    getBoard("2025-07-20", "2025-07-23")
      .then((d) => { if (!ignore) setData(d); })
      .catch((e) => { if (!ignore) setErr(e.message); });
    return () => { ignore = true; };
  }, [refreshToken]);

  if (err) return <div className="text-red-600">Error: {err}</div>;
  if (!data) return <div>Loading board…</div>;

  return (
    <div>
      <div className="mb-2 text-sm text-gray-600">
        Range: {data.range.start} → {data.range.end}
      </div>
      <div className="text-lg font-semibold">Loads: {data.count}</div>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Totals:</h3>
        <div className="text-sm">
          <div>Gross: ${Math.round(grouped.totals.gross).toLocaleString()}</div>
          <div>Miles: {grouped.totals.miles.toLocaleString()}</div>
          <div>Avg RPM: ${Number(grouped.totals.avgRpm).toFixed(2)}</div>
          <div>Active Drivers: {grouped.totals.activeDrivers}</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">By Dispatcher:</h3>
        {grouped.dispatchers.map((disp) => (
          <div key={disp.id} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="font-medium">{disp.name}</div>
            <div className="text-sm text-gray-600">
              ${Math.round(disp.gross).toLocaleString()} | {disp.miles.toLocaleString()}mi | $
              {Number(disp.avgRpm).toFixed(2)} RPM | {disp.drivers.length} drivers
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
