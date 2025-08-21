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

// Mock data for loads (one per delivery, can have multiple per day/driver)
export const mockLoads: Load[] = [
  // Alice Smith (dr1)
  {
    id: "l1", company_id: "co1", dispatcher_id: "d1", driver_id: "dr1",
    pickup_city: "Chicago", pickup_state: "IL", pickup_date: "2025-07-21",
    delivery_city: "Dallas", delivery_state: "TX", delivery_date: "2025-07-21",
    rate: 1200, miles: 600, rpm: 2.00, deadhead: 140, status: "Ready", load_number: "118020", broker_name: "CH Robinson",
    attached_files: ["rate confirmation.pdf", "BOL.pdf", "POD.pdf"],
    pickup_name: "JAYCO", pickup_address: "1470 AVENUE T 1222", pickup_zip: "75050", pickup_time_window: "13:00 - 16:00", pickup_number: "1791006",
    delivery_address: "7701 B COMMERCE BLVD", delivery_zip: "32404", delivery_time_window: "12:00 - 13:00"
  },
  {
    id: "l2", company_id: "co1", dispatcher_id: "d1", driver_id: "dr1",
    pickup_city: "Dallas", pickup_state: "TX", pickup_date: "2025-07-22",
    delivery_city: "Houston", delivery_state: "TX", delivery_date: "2025-07-22",
    rate: 1000, miles: 500, rpm: 2.00, deadhead: 0, status: "Transit", load_number: "118021", broker_name: "TQL",
    attached_files: ["rate confirmation.pdf"],
    pickup_name: "ABC", pickup_address: "123 Main St", pickup_zip: "75201", pickup_time_window: "09:00 - 11:00", pickup_number: "111222",
    delivery_address: "456 Market St", delivery_zip: "77001", delivery_time_window: "14:00 - 16:00"
  },
  {
    id: "l3", company_id: "co1", dispatcher_id: "d1", driver_id: "dr1",
    pickup_city: "Houston", pickup_state: "TX", pickup_date: "2025-07-23",
    delivery_city: "Austin", delivery_state: "TX", delivery_date: "2025-07-23",
    rate: 800, miles: 300, rpm: 2.67, deadhead: 0, status: "HT", load_number: "118022", broker_name: "Coyote",
    attached_files: ["BOL.pdf"],
    pickup_name: "XYZ", pickup_address: "789 Broadway", pickup_zip: "77002", pickup_time_window: "10:00 - 12:00", pickup_number: "333444",
    delivery_address: "321 6th St", delivery_zip: "73301", delivery_time_window: "15:00 - 17:00"
  },
  // Bob Lee (dr2)
  {
    id: "l4", company_id: "co1", dispatcher_id: "d1", driver_id: "dr2",
    pickup_city: "St. Louis", pickup_state: "MO", pickup_date: "2025-07-21",
    delivery_city: "Chicago", delivery_state: "IL", delivery_date: "2025-07-21",
    rate: 900, miles: 400, rpm: 2.25, deadhead: 0, status: "Transit", load_number: "118023", broker_name: "Landstar",
    attached_files: ["rate confirmation.pdf"],
    pickup_name: "DEF", pickup_address: "111 River Rd", pickup_zip: "63101", pickup_time_window: "08:00 - 10:00", pickup_number: "555666",
    delivery_address: "222 Lake St", delivery_zip: "60601", delivery_time_window: "13:00 - 15:00"
  },
  {
    id: "l5", company_id: "co1", dispatcher_id: "d1", driver_id: "dr2",
    pickup_city: "Chicago", pickup_state: "IL", pickup_date: "2025-07-22",
    delivery_city: "Kansas City", delivery_state: "MO", delivery_date: "2025-07-22",
    rate: 1100, miles: 500, rpm: 2.20, deadhead: 0, status: "Ready", load_number: "118024", broker_name: "CH Robinson",
    attached_files: ["POD.pdf"],
    pickup_name: "GHI", pickup_address: "333 Oak St", pickup_zip: "60602", pickup_time_window: "11:00 - 13:00", pickup_number: "777888",
    delivery_address: "444 Pine St", delivery_zip: "64101", delivery_time_window: "16:00 - 18:00"
  },
  // Carlos Diaz (dr3)
  {
    id: "l6", company_id: "co2", dispatcher_id: "d2", driver_id: "dr3",
    pickup_city: "Denver", pickup_state: "CO", pickup_date: "2025-07-21",
    delivery_city: "Salt Lake City", delivery_state: "UT", delivery_date: "2025-07-21",
    rate: 1300, miles: 600, rpm: 2.17, deadhead: 0, status: "HT", load_number: "118025", broker_name: "TQL"
  },
  {
    id: "l7", company_id: "co2", dispatcher_id: "d2", driver_id: "dr3",
    pickup_city: "Salt Lake City", pickup_state: "UT", pickup_date: "2025-07-22",
    delivery_city: "Las Vegas", delivery_state: "NV", delivery_date: "2025-07-22",
    rate: 1200, miles: 500, rpm: 2.40, deadhead: 0, status: "Ready", load_number: "118026", broker_name: "Coyote"
  },
  // Dana Fox (dr4)
  {
    id: "l8", company_id: "co2", dispatcher_id: "d2", driver_id: "dr4",
    pickup_city: "Seattle", pickup_state: "WA", pickup_date: "2025-07-21",
    delivery_city: "Portland", delivery_state: "OR", delivery_date: "2025-07-21",
    rate: 1000, miles: 200, rpm: 5.00, deadhead: 0, status: "Ready", load_number: "118027", broker_name: "Landstar"
  },
  {
    id: "l9", company_id: "co2", dispatcher_id: "d2", driver_id: "dr4",
    pickup_city: "Portland", pickup_state: "OR", pickup_date: "2025-07-22",
    delivery_city: "Boise", delivery_state: "ID", delivery_date: "2025-07-22",
    rate: 900, miles: 400, rpm: 2.25, deadhead: 0, status: "HT", load_number: "118028", broker_name: "TQL"
  },
];

export const mockRanges: DateRange[] = [
  { start: "07/14/25", end: "07/20/25", iso: ["2025-07-14","2025-07-15","2025-07-16","2025-07-17","2025-07-18","2025-07-19","2025-07-20"] },
  { start: "07/21/25", end: "07/27/25", iso: ["2025-07-21","2025-07-22","2025-07-23","2025-07-24","2025-07-25","2025-07-26","2025-07-27"] }, // current week
];

export const weekDays: WeekDay[] = [
  { label: "Mon", idx: 0 },
  { label: "Tue", idx: 1 },
  { label: "Wed", idx: 2 },
  { label: "Thu", idx: 3 },
  { label: "Fri", idx: 4 },
  { label: "Sat", idx: 5 },
  { label: "Sun", idx: 6 },
];
