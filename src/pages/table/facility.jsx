import React, { useEffect, useState } from 'react';
import api from "../../api/api";

const FacilityTablePage = () => {
  const [facility, setFacility] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {   
    api.get('facility/').then(res => setFacility(res.data));
  }, []);

  // Filter cases by search query
  const filteredFacility = facility.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(query) ||
      c.case_source?.toLowerCase().includes(query) 
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔍 Search Panel */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#003366]">Facility Details</h2>
        <input
          type="text"
          placeholder="Search by name or case source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] w-80"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date reported</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Form Completed By</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Health Facility Code</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Case source</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reporting Method</th> 
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFacility.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.full_name}</td>
                <td className="px-4 py-2">{c.designation}</td>
                <td className="px-4 py-2">{c.date_reported}</td>
                <td className="px-4 py-2">{c.form_completed_by}</td>
                <td className="px-4 py-2">{c.health_facility_code}</td>
                <td className="px-4 py-2">{c.case_source}</td>
                <td className="px-4 py-2">{c.reporting_method}</td>
              </tr>
            ))}
            {filteredFacility.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-400">
                  No Facility details found.
                </td>  
              </tr>
            )}
          </tbody>
        </table>    
      </div>
    </div>
  );
};

export default FacilityTablePage;
  