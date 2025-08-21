import React, { useState } from 'react';
import { Stat } from '../../components/ui';
import { DispatcherSection } from './DispatcherSection';
import { DriverPopover } from './popovers/DriverPopover';
import { LoadPopover } from './popovers/LoadPopover';
import { getDispatchersByCompany } from '../../lib/selectors';
import { formatCurrency, formatRPM } from '../../lib/fmt';
import type { Company, Dispatcher, Driver, Load, DateRange, WeekDay, PopupState } from '../../types/domain';

interface BoardProps {
  companies: Company[];
  dispatchers: Dispatcher[];
  drivers: Driver[];
  loads: Load[];
  weekDays: WeekDay[];
  dateRange: DateRange;
  selectedCompany: string;
}

export function Board({ 
  companies, 
  dispatchers, 
  drivers, 
  loads, 
  weekDays, 
  dateRange, 
  selectedCompany 
}: BoardProps) {
  // Filter dispatchers by company
  const filteredDispatchers = getDispatchersByCompany(dispatchers, selectedCompany);

  // Popup states
  const [driverPopup, setDriverPopup] = useState<PopupState<Driver>>({ show: false, data: null, x: 0, y: 0 });
  const [loadPopup, setLoadPopup] = useState<PopupState<Load>>({ show: false, data: null, x: 0, y: 0 });

  // Event handlers
  const showDriverPopup = (e: React.MouseEvent, driver: Driver) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDriverPopup({ show: true, data: driver, x: rect.right + 8, y: rect.top });
  };

  const hideDriverPopup = () => setDriverPopup({ show: false, data: null, x: 0, y: 0 });

  const showLoadPopup = (e: React.MouseEvent, load: Load) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLoadPopup({ show: true, data: load, x: rect.right + 8, y: rect.top });
  };

  const hideLoadPopup = () => setLoadPopup({ show: false, data: null, x: 0, y: 0 });

  const copyDriverInfo = (driver: Driver) => {
    const info = `Name - ${driver.name};\nTruck# - ${driver.truck_number};\nTrailer# - ${driver.trailer_number};\nContact - ${driver.phone}`;
    navigator.clipboard.writeText(info);
  };

  const copyLoadInfo = (load: Load) => {
    const info = `LOAD BOOKED UNDER JMJMN\n\nWest Motor Freight of PA (MC#021866)\n\nLOAD# ${load.load_number}\n====================================\nPU:\n\n${load.pickup_name}\n${load.pickup_address}\n${load.pickup_city}, ${load.pickup_state} ${load.pickup_zip}\n\n${load.pickup_date?.replace(/-/g, "/")}  ${load.pickup_time_window}\n\nPick Up# ${load.pickup_number}\n\n=====================================\nDEL:\n\n${load.delivery_address}\n${load.delivery_city}, ${load.delivery_state} ${load.delivery_zip}\n\n${load.delivery_date?.replace(/-/g, "/")} ${load.delivery_time_window}\n\n=====================================\n$${load.rate}`;
    navigator.clipboard.writeText(info);
  };

  // Calculate overall stats
  const allLoads = loads.filter(l => l.company_id === selectedCompany && dateRange.iso.includes(l.delivery_date));
  const totalGross = allLoads.reduce((sum, l) => sum + l.rate, 0);
  const totalMiles = allLoads.reduce((sum, l) => sum + l.miles, 0);
  const avgRpm = totalMiles ? (totalGross / totalMiles) : 0;
  const activeDrivers = new Set(allLoads.map(l => l.driver_id)).size;

  return (
    <div className="space-y-10">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <Stat label="Weekly Gross" value={formatCurrency(totalGross)} />
        <Stat label="Avg RPM" value={formatRPM(avgRpm)} />
        <Stat label="Active Drivers" value={activeDrivers} />
      </div>

      {/* Table Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-gray-700">Drivers</div>
      </div>

      {/* Dispatcher Sections */}
      <div className="space-y-10">
        {filteredDispatchers.map((dispatcher) => (
          <DispatcherSection
            key={dispatcher.id}
            dispatcher={dispatcher}
            drivers={drivers}
            loads={loads}
            weekDays={weekDays}
            dateRange={dateRange}
            companyId={selectedCompany}
            onDriverClick={showDriverPopup}
            onLoadClick={showLoadPopup}
          />
        ))}
      </div>

      {/* Popovers */}
      {driverPopup.show && driverPopup.data && (
        <DriverPopover
          driver={driverPopup.data}
          x={driverPopup.x}
          y={driverPopup.y}
          onClose={hideDriverPopup}
          onCopy={copyDriverInfo}
        />
      )}
      
      {loadPopup.show && loadPopup.data && (
        <LoadPopover
          load={loadPopup.data}
          x={loadPopup.x}
          y={loadPopup.y}
          onClose={hideLoadPopup}
          onCopy={copyLoadInfo}
        />
      )}
    </div>
  );
}
