import React, { useEffect, useMemo, useState } from "react";
import { getBoard, type BoardResponse, type BoardLoad } from "../../lib/api";
import { groupByDispatcherDriverDay } from "../../lib/selectors";
import { Popover } from "../../components/ui/Popover";

export function Board({ refreshToken = 0, start, end }: { refreshToken?: number; start?: string; end?: string }) {
  const [data, setData] = useState<BoardResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // MUST be called every render (fixes hook order)
  const grouped = useMemo(() => groupByDispatcherDriverDay(data?.loads ?? []), [data?.loads]);

  const [driverPop, setDriverPop] = useState<{ show: boolean; x: number; y: number; driver?: { name: string; gross: number; miles: number; avgRpm: number } }>(() => ({ show: false, x: 0, y: 0 }));
  const [loadPop, setLoadPop] = useState<{ show: boolean; x: number; y: number; load?: BoardLoad }>(() => ({ show: false, x: 0, y: 0 }));
  const [rpmTooltip, setRpmTooltip] = useState<{ show: boolean; x: number; y: number; rpm: number }>(() => ({ show: false, x: 0, y: 0, rpm: 0 }));

  const isoDays = useMemo(() => {
    if (!data) return [] as string[];
    const out: string[] = [];
    const start = new Date(data.range.start + 'T00:00:00Z');
    const end = new Date(data.range.end + 'T00:00:00Z');
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      out.push(`${y}-${m}-${day}`);
    }
    return out;
  }, [data?.range.start, data?.range.end]);

  useEffect(() => {
    let ignore = false;
    const s = start || "2025-07-21";
    const e = end || "2025-07-27";
    getBoard(s, e)
      .then((d) => { if (!ignore) setData(d); })
      .catch((e) => { if (!ignore) setErr(e.message); });
    return () => { ignore = true; };
  }, [refreshToken, start, end]);

  if (err) return <div className="text-red-600">Error: {err}</div>;
  if (!data) return <div>Loading board…</div>;

  return (
    <div>
      <div className="mb-2 text-sm text-gray-600">
        Range: {data.range.start} → {data.range.end}
      </div>
      <div className="text-lg font-semibold">Loads: {data.count}</div>
      <div className="mt-2 flex items-center gap-4 text-sm bg-blue-50 border border-blue-100 rounded px-3 py-2">
        <div className="font-semibold">This week totals:</div>
        <div>Gross ${Math.round(grouped.totals.gross).toLocaleString()}</div>
        <div>• Miles {grouped.totals.miles.toLocaleString()}</div>
        <div>• Avg RPM {Number(grouped.totals.avgRpm).toFixed(2)}</div>
      </div>

      {grouped.dispatchers.map((disp) => (
        <div key={disp.id} className="mt-6">
          <div className="mb-2">
            <div className="text-lg font-semibold">Dispatcher: {disp.name}</div>
            <div className="text-sm text-gray-600">Gross ${Math.round(disp.gross).toLocaleString()} • {disp.miles.toLocaleString()}mi • {Number(disp.avgRpm).toFixed(2)} RPM</div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-50">
                  <th className="px-2 py-2 w-48 border border-gray-200">Driver (click)</th>
                  {isoDays.map((d, idx) => (
                    <th key={d} className="px-1 py-2 text-center w-24 border border-gray-200">
                      <div className="font-semibold">{new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-[10px] text-gray-500">{new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disp.drivers.map((dr, rowIdx) => (
                  <tr key={dr.id} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td className="align-top px-2 py-2 border border-gray-200">
                      <div>
                        <button
                          type="button"
                          className="text-blue-700 underline hover:text-blue-900 font-semibold text-xs"
                          onClick={(e) => {
                            setDriverPop({
                              show: true,
                              x: e.clientX + 8,
                              y: e.clientY + 8,
                              driver: { name: dr.name, gross: dr.gross, miles: dr.miles, avgRpm: dr.avgRpm },
                            });
                          }}
                        >
                          {dr.name}
                        </button>
                      </div>
                      <div className="mt-1 text-[10px] text-gray-600">Gross ${Math.round(dr.gross).toLocaleString()} • {dr.miles.toLocaleString()}mi • {Number(dr.avgRpm).toFixed(2)} RPM</div>
                    </td>
                    {isoDays.map((iso) => {
                      const loadsForDay: BoardLoad[] = dr.byDay[iso] || [];
                      if (loadsForDay.length === 0) return <td key={iso} className="px-1 py-2 text-center text-gray-300 border border-gray-200">—</td>;
                      const l = loadsForDay[0];
                      const rpm = l.miles ? l.rate / l.miles : 0;
                      return (
                        <td key={iso} className="px-1 py-2 text-center border border-gray-200">
                          <button
                            type="button"
                            className="relative mx-auto rounded border text-[10px] px-1 py-1 font-semibold w-full max-w-[100px] truncate bg-white hover:bg-gray-50 border-gray-300"
                            onClick={(e) => setLoadPop({ show: true, x: e.clientX + 8, y: e.clientY + 8, load: l })}
                            onMouseEnter={(e) => setRpmTooltip({ show: true, x: e.clientX + 8, y: e.clientY - 20, rpm })}
                            onMouseLeave={() => setRpmTooltip({ show: false, x: 0, y: 0, rpm: 0 })}
                          >
                            <span className="block text-gray-800 font-medium truncate">{l.deliveryCity}, {l.deliveryState}</span>
                            <span className="block text-[9px] text-gray-600 truncate">${Math.round(l.rate).toLocaleString()} / {l.miles.toLocaleString()}mi</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {driverPop.show && driverPop.driver && (
        <Popover x={driverPop.x} y={driverPop.y} onClose={() => setDriverPop({ show: false, x: 0, y: 0 })}>
          <div className="mb-1 font-bold">{driverPop.driver.name}</div>
          <div>Gross: ${Math.round(driverPop.driver.gross).toLocaleString()}</div>
          <div>Miles: {driverPop.driver.miles.toLocaleString()}</div>
          <div>Avg RPM: {driverPop.driver.avgRpm.toFixed(2)}</div>
        </Popover>
      )}

      {loadPop.show && loadPop.load && (
        <Popover x={loadPop.x} y={loadPop.y} onClose={() => setLoadPop({ show: false, x: 0, y: 0 })}>
          <div className="mb-1 font-bold">{loadPop.load.deliveryCity}, {loadPop.load.deliveryState}</div>
          <div>Rate: ${Math.round(loadPop.load.rate).toLocaleString()}</div>
          <div>Miles: {loadPop.load.miles.toLocaleString()}</div>
          <div>RPM: {(loadPop.load.miles ? loadPop.load.rate / loadPop.load.miles : 0).toFixed(2)}</div>
          {loadPop.load.loadNumber && <div>Load#: {loadPop.load.loadNumber}</div>}
          {loadPop.load.brokerName && <div>Broker: {loadPop.load.brokerName}</div>}
        </Popover>
      )}

      {rpmTooltip.show && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
          style={{ left: rpmTooltip.x, top: rpmTooltip.y }}
        >
          RPM: {rpmTooltip.rpm.toFixed(2)}
        </div>
      )}
    </div>
  );
}
