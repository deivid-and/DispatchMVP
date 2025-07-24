import React, { useState, useRef, useEffect } from "react";

const companies = ["JMJNM", "CO1", "CO2"];

function Navbar() {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [userOpen, setUserOpen] = useState(false);
  const companyRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (companyRef.current && !companyRef.current.contains(e.target)) {
        setCompanyOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Company Dropdown */}
        <div className="relative" ref={companyRef}>
          <button
            className="flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition focus:outline-none"
            onClick={() => setCompanyOpen((open) => !open)}
          >
            {selectedCompany}
            <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {companyOpen && (
            <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg py-1">
              {companies.slice(1).map((co) => (
                <button
                  key={co}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCompany(co);
                    setCompanyOpen(false);
                  }}
                >
                  {co}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-300 focus:outline-none"
            onClick={() => setUserOpen((open) => !open)}
          >
            D
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg py-1">
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</button>
              <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 