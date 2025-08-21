import React, { useState } from 'react';
import type { Company } from '../../types/domain';

interface StickyHeaderProps {
  companies: Company[];
  selectedCompany: string;
  onCompanyChange: (companyId: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function StickyHeader({ companies, selectedCompany, onCompanyChange, user }: StickyHeaderProps) {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const selectedCompanyData = companies.find(c => c.id === selectedCompany);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">DispatchMVP</h1>
            </div>
          </div>

          {/* Center - Company Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>{selectedCompanyData?.name || 'Select Company'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCompanyDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => {
                          onCompanyChange(company.id);
                          setShowCompanyDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          company.id === selectedCompany
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Profile and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.5l2.5 2.5H2.5L5 14.25v-4.5a6 6 0 0 1 6-6z" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {user?.avatar ? (
                  <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <span className="hidden md:block text-gray-700">{user?.name || 'User'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.name || 'User'}</div>
                      <div className="text-gray-500">{user?.email || 'user@example.com'}</div>
                    </div>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Profile Settings
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Account Settings
                    </button>
                    <div className="border-t border-gray-100">
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showCompanyDropdown || showProfileDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowCompanyDropdown(false);
            setShowProfileDropdown(false);
          }}
        />
      )}
    </header>
  );
} 