import React, { useEffect, useState } from 'react';
import api from "../../api/api";

const Surveillance_infoTablePage = () => {
  const [surveillance_info, setSurveillance_info] = useState([]);
  const [search, setSearch] = useState("");  

  useEffect(() => {   
    api.get('surveillance_info/').then(res => setSurveillance_info(res.data));
  }, []);

  // Filter cases by search query
  const filteredSurveillance_info = surveillance_info.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(query) ||
      c.symptoms?.toLowerCase().includes(query) ||
      c.disease?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔍 Search Panel */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#003366]">Surveillance info</h2>
        <input
          type="text"
          placeholder="Search by name, district, or disease..."
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
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reporting Week Number</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Reported</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notifier Signature</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reviewed By</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supervisor Comments</th> 
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSurveillance_info.map((c, i) => (   
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.full_name}</td>
                <td className="px-4 py-2">{c.reporting_week_number}</td>
                <td className="px-4 py-2">{c.year}</td>
                <td className="px-4 py-2">{c.date_reported}</td>
                <td className="px-4 py-2">{c.notifier_signature}</td>
                <td className="px-4 py-2">{c.reviewed_by}</td>
                <td className="px-4 py-2">{c.supervisor_comments}</td>
              </tr>
            ))}
            {filteredSurveillance_info.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-400">
                  No surveillance info found.
                </td>
              </tr>
            )}  
          </tbody>
        </table>    
      </div>
    </div>
  );
};

export default Surveillance_infoTablePage;
