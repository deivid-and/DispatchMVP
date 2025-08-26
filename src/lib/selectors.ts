import type { BoardLoad } from "./api";

export type DayISO = string; // 'YYYY-MM-DD'

export function calcTotals(loads: BoardLoad[]) {
  const gross = loads.reduce((s, l) => s + (l.rate || 0), 0);
  const miles = loads.reduce((s, l) => s + (l.miles || 0), 0);
  const avgRpm = miles ? gross / miles : 0;
  const activeDrivers = new Set(loads.map((l) => l.driverId)).size;
  return { gross, miles, avgRpm, activeDrivers };
}

export function groupByDispatcherDriverDay(loads: BoardLoad[]) {
  const byDisp = new Map<string, any>();

  for (const l of loads) {
    if (!l.deliveryDate) continue;
    
    if (!byDisp.has(l.dispatcherId)) {
      byDisp.set(l.dispatcherId, {
        id: l.dispatcherId,
        name: l.dispatcher.name,
        drivers: new Map(),
        loads: []
      });
    }
    const disp = byDisp.get(l.dispatcherId);
    disp.loads.push(l);

    if (!disp.drivers.has(l.driverId)) {
      disp.drivers.set(l.driverId, {
        id: l.driverId,
        name: l.driver.name,
        loadsByDay: new Map()
      });
    }
    const drv = disp.drivers.get(l.driverId);
    
    if (!drv.loadsByDay.has(l.deliveryDate)) {
      drv.loadsByDay.set(l.deliveryDate, []);
    }
    drv.loadsByDay.get(l.deliveryDate).push(l);
  }

  const dispatchers = Array.from(byDisp.values()).map((d: any) => {
    const dTotals = calcTotals(d.loads);
    const drivers = Array.from(d.drivers.values()).map((dr: any) => {
      const entries = Array.from(dr.loadsByDay.entries());
      entries.sort((a: any, b: any) => a[0] > b[0] ? 1 : -1);
      const drLoads = entries.flatMap((entry: any) => entry[1]);
      const t = calcTotals(drLoads);
      const byDay: Record<string, BoardLoad[]> = {};
      entries.forEach((entry: any) => {
        byDay[entry[0]] = entry[1];
      });
      return { id: dr.id, name: dr.name, gross: t.gross, miles: t.miles, avgRpm: t.avgRpm, byDay };
    });
    return { id: d.id, name: d.name, gross: dTotals.gross, miles: dTotals.miles, avgRpm: dTotals.avgRpm, drivers };
  });

  const totals = calcTotals(loads);
  return { dispatchers, totals };
}

// Legacy selector functions for backward compatibility
export function getDriversForDispatcher(drivers: any[], dispatcherId: string): any[] {
  return drivers.filter(dr => dr.dispatcherId === dispatcherId);
}

export function getLoadsForDriverInRange(loads: BoardLoad[], driverId: string, dateRange: string[], companyId: string): BoardLoad[] {
  return loads.filter(l => 
    l.driverId === driverId && 
    dateRange.includes(l.deliveryDate || '') && 
    l.companyId === companyId
  );
}

export function getLoadsForDispatcherInRange(loads: BoardLoad[], drivers: any[], dispatcherId: string, dateRange: string[], companyId: string): BoardLoad[] {
  const driverIds = getDriversForDispatcher(drivers, dispatcherId).map(d => d.id);
  return loads.filter(l => 
    driverIds.includes(l.driverId) && 
    dateRange.includes(l.deliveryDate || '') && 
    l.companyId === companyId
  );
}
