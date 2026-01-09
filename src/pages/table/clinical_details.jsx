import React, { useEffect, useState } from 'react';
import api from "../../api/api";

const ClinicalTablePage = () => {
  const [clinical, setClinical] = useState([]);
  const [search, setSearch] = useState("");  
    
  useEffect(() => {   
    api.get('/clinical/').then(res => setClinical(res.data));
  }, []);

  // Filter cases by search query
  const filteredClinical = clinical.filter((c) => {
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
        <h2 className="text-lg font-semibold text-[#003366]">Clinical Details</h2>
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
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Disease</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Case Classification</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Symptoms</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Triage Level</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Diagnosis Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Final Case Classification</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClinical.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.patient_id}</td>   
                <td className="px-4 py-2">{c.disease}</td>
                <td className="px-4 py-2">{c.case_classification}</td>
                <td className="px-4 py-2">{c.symptoms}</td>
                <td className="px-4 py-2">{c.triage_level}</td>
                <td className="px-4 py-2">{c.admission_status}</td>
                <td className="px-4 py-2">{c.diagnosis_type}</td>
                <td className="px-4 py-2">{c.final_case_classification}</td>
              </tr>
            ))}
            {filteredClinical.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-400">
                  No clinical details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>    
      </div>
    </div>
  );
};

export default ClinicalTablePage;
