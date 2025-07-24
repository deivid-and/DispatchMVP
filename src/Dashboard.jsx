import React, { useState } from "react";

const mockDispatchers = [
  {
    name: "Roger",
    stats: { gross: 4200, rpm: 2.10 },
    drivers: [
      {
        name: "Alice Smith",
        week: [
          { status: "Ready", city: "Dallas, TX" },
          { status: "Transit", city: "Houston, TX" },
          { status: "HT", city: "Austin, TX" },
          { status: "Late", city: "San Antonio, TX" },
          { status: "Transit", city: "Dallas, TX" },
          { status: "Ready", city: "Houston, TX" },
          { status: "HT", city: "Austin, TX" },
        ],
      },
      {
        name: "Bob Lee",
        week: [
          { status: "Transit", city: "Chicago, IL" },
          { status: "Ready", city: "St. Louis, MO" },
          { status: "Late", city: "Kansas City, MO" },
          { status: "HT", city: "Omaha, NE" },
          { status: "Transit", city: "Des Moines, IA" },
          { status: "HT", city: "Minneapolis, MN" },
          { status: "Ready", city: "Fargo, ND" },
        ],
      },
    ],
  },
  {
    name: "Rocky",
    stats: { gross: 3900, rpm: 1.95 },
    drivers: [
      {
        name: "Carlos Diaz",
        week: [
          { status: "HT", city: "Denver, CO" },
          { status: "Transit", city: "Salt Lake City, UT" },
          { status: "Ready", city: "Las Vegas, NV" },
          { status: "Transit", city: "Phoenix, AZ" },
          { status: "Late", city: "Tucson, AZ" },
          { status: "HT", city: "El Paso, TX" },
          { status: "Ready", city: "Albuquerque, NM" },
        ],
      },
      {
        name: "Dana Fox",
        week: [
          { status: "Ready", city: "Seattle, WA" },
          { status: "HT", city: "Portland, OR" },
          { status: "Transit", city: "Boise, ID" },
          { status: "Late", city: "Spokane, WA" },
          { status: "Transit", city: "Missoula, MT" },
          { status: "Ready", city: "Billings, MT" },
          { status: "HT", city: "Bismarck, ND" },
        ],
      },
    ],
  },
];

const mockRanges = [
  { start: "07/14/25", end: "07/20/25" },
  { start: "07/21/25", end: "07/27/25" }, // current week
];

const weekDays = [
  { label: "Mon", date: "07/21" },
  { label: "Tue", date: "07/22" },
  { label: "Wed", date: "07/23" },
  { label: "Thu", date: "07/24" },
  { label: "Fri", date: "07/25" },
  { label: "Sat", date: "07/26" },
  { label: "Sun", date: "07/27" },
];

const statusColor = {
  Ready: "bg-red-100 text-red-700 border-red-300",
  Transit: "bg-yellow-100 text-yellow-800 border-yellow-300",
  HT: "bg-pink-100 text-pink-700 border-pink-300",
  Late: "bg-amber-200 text-amber-900 border-amber-400",
};

function Dashboard() {
  // 1 = current week, 0 = previous week
  const [rangeIdx, setRangeIdx] = useState(1);
  const range = mockRanges[rangeIdx];

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
      <div className="space-y-8">
        {mockDispatchers.map((dispatcher) => (
          <div key={dispatcher.name} className="bg-white rounded shadow p-6 border border-gray-100">
            {/* Dispatcher Name */}
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-800">{dispatcher.name}</h2>
            </div>
            {/* Dispatcher Stats */}
            <div className="flex gap-6 mb-4">
              <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                Total Drivers: <span className="font-semibold text-blue-600">{dispatcher.drivers.length}</span>
              </div>
              <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                Total Gross: <span className="font-semibold text-blue-600">${dispatcher.stats.gross.toLocaleString()}</span>
              </div>
              <div className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200">
                Avg RPM: <span className="font-semibold text-blue-600">${dispatcher.stats.rpm.toFixed(2)}</span>
              </div>
            </div>
            {/* Weekly Calendar Grid */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-3 text-left font-semibold w-40">Driver</th>
                    {weekDays.map((day) => (
                      <th key={day.label} className="px-3 py-3 text-center font-semibold w-32">
                        <div>{day.label}</div>
                        <div className="text-xs text-gray-400">{day.date}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dispatcher.drivers.map((driver, idx) => (
                    <tr key={driver.name} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">{driver.name}</td>
                      {driver.week.map((day, i) => (
                        <td key={i} className="px-2 py-2 text-center">
                          <div className={`mx-auto rounded border text-xs px-2 py-1 font-semibold w-full max-w-[110px] truncate ${statusColor[day.status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
                            {day.city}
                          </div>
                          <div className={`mt-1 text-xs font-bold ${statusColor[day.status] || "text-gray-500"}`}>{day.status}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 