import type { Load, DispatcherStats, DriverStats } from '../../../types/domain';

/**
 * Compute dispatcher statistics from loads
 */
export function computeDispatcherStats(loads: Load[]): DispatcherStats {
  const gross = loads.reduce((sum, l) => sum + l.rate, 0);
  const miles = loads.reduce((sum, l) => sum + l.miles, 0);
  const avgRpm = miles ? (gross / miles) : 0;
  
  return {
    gross,
    avgRpm,
    totalLoads: loads.length,
    miles
  };
}

/**
 * Compute driver statistics from loads
 */
export function computeDriverStats(loads: Load[]): DriverStats {
  const gross = loads.reduce((sum, l) => sum + l.rate, 0);
  const miles = loads.reduce((sum, l) => sum + l.miles, 0);
  const avgRpm = miles ? (gross / miles) : 0;
  
  return {
    gross,
    miles,
    avgRpm
  };
}
