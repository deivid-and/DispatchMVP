import React, { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { PageHeader } from "../components/header/PageHeader";
import { Board } from "../features/board/Board";
import { mockCompanies, mockRanges } from "../data/mock";
import AddLoadModal from "../features/loads/AddLoadModal";
import AddLoadForm from "../features/loads/AddLoadForm";

export function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(mockCompanies[0].id);
  const [rangeIdx, setRangeIdx] = useState(1);
  const range = mockRanges[rangeIdx];

  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const user = {
    name: "John Doe",
    email: "john.doe@dispatchmvp.com",
    avatar: undefined,
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
          onClick={() => setShowAdd(true)}
        >
          Add New Load
        </button>
      </PageHeader>

      <Board refreshToken={refresh} />

      <AddLoadModal open={showAdd} onClose={() => setShowAdd(false)}>
        <AddLoadForm
          defaultCompanyId={selectedCompany}
          onCancel={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            setRefresh((r) => r + 1);
          }}
        />
      </AddLoadModal>
    </MainLayout>
  );
}
