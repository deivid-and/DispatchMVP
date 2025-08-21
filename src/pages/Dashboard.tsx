import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { PageHeader } from '../components/header/PageHeader';
import { Board } from '../features/board/Board';
import { mockCompanies, mockDispatchers, mockDrivers, mockLoads, mockRanges, weekDays } from '../data/mock';

export function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(mockCompanies[0].id);
  const [rangeIdx, setRangeIdx] = useState(1);
  const range = mockRanges[rangeIdx];

  // Mock user data - in a real app this would come from auth context
  const user = {
    name: "John Doe",
    email: "john.doe@dispatchmvp.com",
    avatar: undefined
  };

  return (
    <MainLayout
      companies={mockCompanies}
      selectedCompany={selectedCompany}
      onCompanyChange={setSelectedCompany}
      user={user}
    >
      <PageHeader 
        title="Dashboard"
        range={range}
        rangeIdx={rangeIdx}
        onRangeChange={setRangeIdx}
        maxRangeIdx={mockRanges.length - 1}
      >
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
          type="button"
        >
          Add New Load
        </button>
      </PageHeader>
      
      <Board
        companies={mockCompanies}
        dispatchers={mockDispatchers}
        drivers={mockDrivers}
        loads={mockLoads}
        weekDays={weekDays}
        dateRange={range}
        selectedCompany={selectedCompany}
      />
    </MainLayout>
  );
}
