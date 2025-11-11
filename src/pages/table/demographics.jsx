import React, { useEffect, useState } from 'react';
import api from "../../api/api";
    
const DemographicsTablePage = () => {    
  const [demographics, setDemographics] = useState([]);
  const [search, setSearch] = useState("");  
   
  useEffect(() => {   
    api.get('demographics/').then(res => setDemographics(res.data));
  }, []);
     
  // Filter cases by search query
  const filteredDemographics = demographics.filter((c) => {    
    const query = search.toLowerCase();   
    return (
      c.full_name?.toLowerCase().includes(query) ||
      c.village?.toLowerCase().includes(query)    
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔍 Search Panel */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#003366]">Demographics</h2>
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
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sex</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date of birth</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">National ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Village</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">District</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region</th>  
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDemographics.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.full_name}</td>
                <td className="px-4 py-2">{c.age}</td>
                <td className="px-4 py-2">{c.sex}</td>
                <td className="px-4 py-2">{c.date_of_birth}</td>
                <td className="px-4 py-2">{c.national_id}</td>
                <td className="px-4 py-2">{c.village}</td>
                <td className="px-4 py-2">{c.district}</td>
                <td className="px-4 py-2">{c.region}</td>
              </tr>
            ))}
            {filteredDemographics.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-400">
                  No demographics details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>    
      </div>
    </div>
  );   
};

export default DemographicsTablePage;
