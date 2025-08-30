import type { Company, Dispatcher, Driver, Load, DateRange, WeekDay } from '../types/domain';

// Mock data for companies
export const mockCompanies: Company[] = [
  { id: "co1", name: "JMJNM" },
  { id: "co2", name: "Acme Logistics" },
];

// Mock data for dispatchers
export const mockDispatchers: Dispatcher[] = [
  { id: "d1", name: "Roger", company_ids: ["co1"] },
  { id: "d2", name: "Rocky", company_ids: ["co1", "co2"] },
];

// Mock data for drivers
export const mockDrivers: Driver[] = [
  { id: "dr1", name: "Alice Smith", dispatcher_id: "d1", truck_number: "TX1234", trailer_number: "TR5678", trailer_type: "dryvan", phone: "+1 555-123-4567", notes: "No notes" },
  { id: "dr2", name: "Bob Lee", dispatcher_id: "d1", truck_number: "TX2345", trailer_number: "TR6789", trailer_type: "reefer", phone: "+1 555-234-5678", notes: "Prefers night shifts" },
  { id: "dr3", name: "Carlos Diaz", dispatcher_id: "d2", truck_number: "CA3456", trailer_number: "TR7890", trailer_type: "flatbed", phone: "+1 555-345-6789", notes: "Spanish speaker" },
  { id: "dr4", name: "Dana Fox", dispatcher_id: "d2", truck_number: "CA4567", trailer_number: "TR8901", trailer_type: "stepdeck", phone: "+1 555-456-7890", notes: "Team driver" },
];

// Mock data for loads (empty for testing)
export const mockLoads: Load[] = [];

// Helper function to get current week dates
function getCurrentWeekDates(): DateRange[] {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
  
  const ranges: DateRange[] = [];
  
  // Current week
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Sunday
  
  const currentWeekIso: string[] = [];
  for (let d = new Date(currentWeekStart); d <= currentWeekEnd; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    currentWeekIso.push(`${y}-${m}-${day}`);
  }
  
  ranges.push({
    start: currentWeekIso[0],
    end: currentWeekIso[6],
    iso: currentWeekIso
  });
  
  // Previous week
  const prevWeekStart = new Date(currentWeekStart);
  prevWeekStart.setDate(currentWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(prevWeekStart);
  prevWeekEnd.setDate(prevWeekStart.getDate() + 6);
  
  const prevWeekIso: string[] = [];
  for (let d = new Date(prevWeekStart); d <= prevWeekEnd; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    prevWeekIso.push(`${y}-${m}-${day}`);
  }
  
  ranges.unshift({
    start: prevWeekIso[0],
    end: prevWeekIso[6],
    iso: prevWeekIso
  });
  
  return ranges;
}

export const mockRanges: DateRange[] = getCurrentWeekDates();

export const weekDays: WeekDay[] = [
  { label: "Mon", idx: 0 },
  { label: "Tue", idx: 1 },
  { label: "Wed", idx: 2 },
  { label: "Thu", idx: 3 },
  { label: "Fri", idx: 4 },
  { label: "Sat", idx: 5 },
  { label: "Sun", idx: 6 },
];
