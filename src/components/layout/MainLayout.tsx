import React from 'react';
import { StickyHeader } from './StickyHeader';
import type { Company } from '../../types/domain';

interface MainLayoutProps {
  children: React.ReactNode;
  companies: Company[];
  selectedCompany: string;
  onCompanyChange: (companyId: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function MainLayout({ 
  children, 
  companies, 
  selectedCompany, 
  onCompanyChange, 
  user 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={onCompanyChange}
        user={user}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 