import React, { useState } from "react";

// Mock data for companies
const mockCompanies = [
  { id: "co1", name: "JMJNM" },
  { id: "co2", name: "Acme Logistics" },
];

// Mock data for dispatchers
const mockDispatchers = [
  { id: "d1", name: "Roger", company_ids: ["co1"] },
  { id: "d2", name: "Rocky", company_ids: ["co1", "co2"] },
];

// Mock data for drivers
const mockDrivers = [
  { id: "dr1", name: "Alice Smith", dispatcher_id: "d1" },
  { id: "dr2", name: "Bob Lee", dispatcher_id: "d1" },
  { id: "dr3", name: "Carlos Diaz", dispatcher_id: "d2" },
  { id: "dr4", name: "Dana Fox", dispatcher_id: "d2" },
];

// Mock data for loads (one per delivery, can have multiple per day/driver)
const mockLoads = [
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

const mockRanges = [
  { start: "07/14/25", end: "07/20/25", iso: ["2025-07-14","2025-07-15","2025-07-16","2025-07-17","2025-07-18","2025-07-19","2025-07-20"] },
  { start: "07/21/25", end: "07/27/25", iso: ["2025-07-21","2025-07-22","2025-07-23","2025-07-24","2025-07-25","2025-07-26","2025-07-27"] }, // current week
];

const weekDays = [
  { label: "Mon", idx: 0 },
  { label: "Tue", idx: 1 },
  { label: "Wed", idx: 2 },
  { label: "Thu", idx: 3 },
  { label: "Fri", idx: 4 },
  { label: "Sat", idx: 5 },
  { label: "Sun", idx: 6 },
];

const statusColor = {
  Ready: "bg-red-100 text-red-700 border-red-300",
  Transit: "bg-yellow-100 text-yellow-800 border-yellow-300",
  HT: "bg-pink-100 text-pink-700 border-pink-300",
  Late: "bg-amber-200 text-amber-900 border-amber-400",
};

function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(mockCompanies[0].id);
  const [rangeIdx, setRangeIdx] = useState(1);
  const range = mockRanges[rangeIdx];

  // Filter dispatchers by company
  const filteredDispatchers = mockDispatchers.filter(d => d.company_ids.includes(selectedCompany));

  // For each dispatcher, get their drivers
  const getDriversForDispatcher = (dispatcherId) =>
    mockDrivers.filter(dr => dr.dispatcher_id === dispatcherId);

  // For each driver, get their loads for the week
  const getLoadsForDriverAndDay = (driverId, dayIso) =>
    mockLoads.filter(l => l.driver_id === driverId && l.delivery_date === dayIso && l.company_id === selectedCompany);

  // For dispatcher stats, sum up loads for all their drivers for the week
  const getDispatcherStats = (dispatcherId) => {
    const driverIds = getDriversForDispatcher(dispatcherId).map(d => d.id);
    const loads = mockLoads.filter(l => driverIds.includes(l.driver_id) && range.iso.includes(l.delivery_date) && l.company_id === selectedCompany);
    const gross = loads.reduce((sum, l) => sum + l.rate, 0);
    const miles = loads.reduce((sum, l) => sum + l.miles, 0);
    const avgRpm = miles ? (gross / miles) : 0;
    return { gross, avgRpm, totalLoads: loads.length, miles };
  };

  // Tooltip state
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });

  // Tooltip handler
  const showTooltip = (e, load) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.right + 8,
      y: rect.top,
      content: load,
    });
  };
  const hideTooltip = () => setTooltip({ show: false, x: 0, y: 0, content: null });

  return (
    <div className="w-full px-6 md:px-12 pt-8 pb-12">
      {/* Title Row with Date Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center">
          <button
            className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
            onClick={() => setRangeIdx((i) => Math.max(0, i - 1))}
            disabled={rangeIdx === 0}
            aria-label="Previous week"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="mx-4 text-lg font-medium text-gray-700 tracking-wide select-none">
            {range.start} - {range.end}
          </span>
          {rangeIdx < mockRanges.length - 1 ? (
            <button
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
              onClick={() => setRangeIdx((i) => Math.min(mockRanges.length - 1, i + 1))}
              aria-label="Next week"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="px-2 py-1 text-gray-300 cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Weekly Gross</span>
          <span className="text-2xl font-semibold text-blue-600">$0</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Avg RPM</span>
          <span className="text-2xl font-semibold text-blue-600">$0.00</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Active Drivers</span>
          <span className="text-2xl font-semibold text-blue-600">0</span>
        </div>
      </div>

      {/* Table Header Row with Button */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-gray-700">Drivers</div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition">Add New Load</button>
      </div>

      {/* Dispatcher Sections */}
      <div className="space-y-10">
        {filteredDispatchers.map((dispatcher) => {
          const drivers = getDriversForDispatcher(dispatcher.id);
          const stats = getDispatcherStats(dispatcher.id);
          return (
            <section key={dispatcher.id} className="bg-white rounded shadow p-6 border border-gray-100">
              {/* Dispatcher Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-800">{dispatcher.name}</h2>
                  <span className="text-xs text-gray-400">Dispatcher</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
                  <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                    Weekly Gross: <span className="font-semibold text-blue-600">${stats.gross.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                    Avg RPM: <span className="font-semibold text-blue-600">{stats.avgRpm.toFixed(2)}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                    Loads: <span className="font-semibold text-blue-600">{stats.totalLoads}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                    Total Miles: <span className="font-semibold text-blue-600">{stats.miles.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {/* Drivers Calendar Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="px-4 py-3 text-left font-semibold w-40">Driver</th>
                      {weekDays.map((day) => (
                        <th key={day.label} className="px-3 py-3 text-center font-semibold w-32">
                          <div>{day.label}</div>
                          <div className="text-xs text-gray-400">{range.iso[day.idx].slice(5).replace("-", "/")}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver, idx) => (
                      <tr key={driver.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                          <div>{driver.name}</div>
                        </td>
                        {weekDays.map((day) => {
                          const dayIso = range.iso[day.idx];
                          const loads = getLoadsForDriverAndDay(driver.id, dayIso);
                          if (loads.length === 0) {
                            return <td key={day.label} className="px-2 py-2 text-center text-gray-300">—</td>;
                          }
                          // For MVP, just show the first load if multiple
                          const load = loads[0];
                          return (
                            <td key={day.label} className="px-2 py-2 text-center">
                              <div
                                className={`relative mx-auto rounded border text-xs px-2 py-1 font-semibold w-full max-w-[110px] truncate bg-white ${statusColor[load.status] || "bg-gray-100 text-gray-500 border-gray-200"}`}
                                onMouseEnter={e => showTooltip(e, load)}
                                onMouseLeave={hideTooltip}
                                style={{ cursor: 'pointer' }}
                              >
                                <span className="block text-gray-800 font-medium">{load.delivery_city}, {load.delivery_state}</span>
                                {/* Status badge as a small colored bar at the bottom */}
                                <span className={`absolute left-0 bottom-0 w-full h-1 rounded-b ${
                                  load.status === "Ready" ? "bg-red-500" :
                                  load.status === "Transit" ? "bg-yellow-300" :
                                  load.status === "HT" ? "bg-pink-400" :
                                  load.status === "Late" ? "bg-amber-700" :
                                  "bg-gray-200"
                                }`} />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
      {tooltip.show && <Tooltip x={tooltip.x} y={tooltip.y} load={tooltip.content} onClose={hideTooltip} />}
    </div>
  );
}

export default Dashboard;

// Tooltip component
function Tooltip({ x, y, load, onClose }) {
  if (!load) return null;
  return (
    <div
      className="fixed z-50 bg-white border border-gray-300 rounded shadow-lg p-4 text-xs max-w-xs"
      style={{ left: x, top: y }}
      onMouseLeave={onClose}
    >
      <div className="mb-2 text-xs font-bold text-blue-700">LOAD BOOKED UNDER JMJMN</div>
      <div className="mb-1 text-gray-700">{load.broker_name} (MC#021866)</div>
      <div className="mb-2">
        <a href="#" className="text-blue-600 underline font-bold" onClick={e => { e.preventDefault(); alert('Show full load details modal!'); }}>{`LOAD# ${load.load_number}`}</a>
      </div>
      <div className="border-t border-gray-200 my-2" />
      <div className="mb-1 font-bold">PU:</div>
      <div>{load.pickup_name}</div>
      <div>{load.pickup_address}</div>
      <div>{load.pickup_city}, {load.pickup_state} {load.pickup_zip}</div>
      <div>{load.pickup_date?.replace(/-/g, "/")} {load.pickup_time_window}</div>
      <div>Pick Up# {load.pickup_number}</div>
      <div className="border-t border-gray-200 my-2" />
      <div className="mb-1 font-bold">DEL:</div>
      <div>{load.delivery_address}</div>
      <div>{load.delivery_city}, {load.delivery_state} {load.delivery_zip}</div>
      <div>{load.delivery_date?.replace(/-/g, "/")} {load.delivery_time_window}</div>
      <div className="border-t border-gray-200 my-2" />
      <div className="mb-1 font-bold">${load.rate}</div>
      <div className="mt-2">
        <div className="font-bold mb-1">Attached Files:</div>
        <ul className="list-disc pl-4">
          {load.attached_files?.map(f => (
            <li key={f} className="text-blue-700 underline cursor-pointer" onClick={() => alert(`Download ${f}`)}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 