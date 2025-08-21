export interface Company {
  id: string;
  name: string;
}

export interface Dispatcher {
  id: string;
  name: string;
  company_ids: string[];
}

export interface Driver {
  id: string;
  name: string;
  dispatcher_id: string;
  truck_number: string;
  trailer_number: string;
  trailer_type: string;
  phone: string;
  notes: string;
}

export interface Load {
  id: string;
  company_id: string;
  dispatcher_id: string;
  driver_id: string;
  pickup_city: string;
  pickup_state: string;
  pickup_date: string;
  delivery_city: string;
  delivery_state: string;
  delivery_date: string;
  rate: number;
  miles: number;
  rpm: number;
  deadhead: number;
  status: LoadStatus;
  load_number: string;
  broker_name: string;
  attached_files?: string[];
  pickup_name?: string;
  pickup_address?: string;
  pickup_zip?: string;
  pickup_time_window?: string;
  pickup_number?: string;
  delivery_address?: string;
  delivery_zip?: string;
  delivery_time_window?: string;
}

export type LoadStatus = 'Ready' | 'Transit' | 'HT' | 'Late';

export interface DateRange {
  start: string;
  end: string;
  iso: string[];
}

export interface WeekDay {
  label: string;
  idx: number;
}

export interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  content: Load | null;
}

export interface PopupState<T> {
  show: boolean;
  data: T | null;
  x: number;
  y: number;
}

export interface NewLoad {
  company: string;
  broker: string;
  broker_mc_number: string;
  load_number: string;
  pickup_name: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip: string;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end: string;
  pickup_number: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip: string;
  delivery_date: string;
  delivery_time_start: string;
  delivery_time_end: string;
  rate: string;
}

export interface DispatcherStats {
  gross: number;
  avgRpm: number;
  totalLoads: number;
  miles: number;
}

export interface DriverStats {
  gross: number;
  miles: number;
  avgRpm: number;
}
