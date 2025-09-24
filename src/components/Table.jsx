import React, { useEffect, useState } from 'react';
import api from "../api/api";

const TablePage = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {   
    api.get('cases/').then(res => setCases(res.data));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">District</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Facility</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Disease</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.full_name}</td>
                <td className="px-4 py-2">{c.sex}</td>
                <td className="px-4 py-2">{c.district}</td>
                <td className="px-4 py-2">{c.health_facility}</td>
                <td className="px-4 py-2">{c.date_reported}</td>
                <td className="px-4 py-2">{c.disease}</td>
              </tr>
            ))}
            {cases.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-400">
                  No cases available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePage;
