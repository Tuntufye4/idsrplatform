import React, { useEffect, useState } from 'react';
import api from "../../api/api";

const EpidemicsTablePage = () => {    
  const [epidemics, setEpidemics] = useState([]);
  const [search, setSearch] = useState("");  
     
  useEffect(() => {   
    api.get('epidemiological/').then(res => setEpidemics(res.data));
  }, []);
     
  // Filter cases by search query
  const filteredEpidemics = epidemics.filter((c) => {    
    const query = search.toLowerCase();   
    return (
      c.full_name?.toLowerCase().includes(query) ||
      c.exposure_source?.toLowerCase().includes(query) 
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔍 Search Panel */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#003366]">Epidemiological</h2>
        <input
          type="text"
          placeholder="Search by name or exposure_source..."
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
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Environmental risk factors</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exposure source</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cluster related</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEpidemics.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.patient_id}</td>   
                <td className="px-4 py-2">{c.environmental_risk_factors}</td>
                <td className="px-4 py-2">{c.exposure_source}</td>
                <td className="px-4 py-2">{c.cluster_related}</td>
              </tr>
            ))}
            {filteredEpidemics.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-400">
                  No Epidemics details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>    
      </div>
    </div>
  );
};

export default EpidemicsTablePage;
