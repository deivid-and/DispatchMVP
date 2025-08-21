import type { Dispatcher, Driver, Load } from '../types/domain';

/**
 * Get dispatchers filtered by company ID
 */
export function getDispatchersByCompany(dispatchers: Dispatcher[], companyId: string): Dispatcher[] {
  return dispatchers.filter(d => d.company_ids.includes(companyId));
}

/**
 * Get drivers for a specific dispatcher
 */
export function getDriversForDispatcher(drivers: Driver[], dispatcherId: string): Driver[] {
  return drivers.filter(dr => dr.dispatcher_id === dispatcherId);
}

/**
 * Get loads for a specific driver and day
 */
export function getLoadsForDriverAndDay(loads: Load[], driverId: string, dayIso: string, companyId: string): Load[] {
  return loads.filter(l => 
    l.driver_id === driverId && 
    l.delivery_date === dayIso && 
    l.company_id === companyId
  );
}

/**
 * Get loads for a specific dispatcher in a date range
 */
export function getLoadsForDispatcherInRange(
  loads: Load[], 
  drivers: Driver[],
  dispatcherId: string, 
  dateRange: string[], 
  companyId: string
): Load[] {
  const driverIds = getDriversForDispatcher(drivers, dispatcherId).map(d => d.id);
  return loads.filter(l => 
    driverIds.includes(l.driver_id) && 
    dateRange.includes(l.delivery_date) && 
    l.company_id === companyId
  );
}

/**
 * Get loads for a specific driver in a date range
 */
export function getLoadsForDriverInRange(
  loads: Load[], 
  driverId: string, 
  dateRange: string[], 
  companyId: string
): Load[] {
  return loads.filter(l => 
    l.driver_id === driverId && 
    dateRange.includes(l.delivery_date) && 
    l.company_id === companyId
  );
}
