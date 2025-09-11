import React, { useEffect, useState } from 'react';
import api from "../api/api";


const TablePage = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get('cases/').then(res => setCases(res.data));
  }, []);

  return (
    <div>  
      <h2 className="text-2xl font-bold mb-4">Case Records</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Gender</th>   
            <th className="border p-2">District</th>
            <th className="border p-2">Facility</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Disease</th>
          </tr>   
        </thead>
        <tbody>
          {cases.map((c, i) => (
            <tr key={i}>
              <td className="border p-2">{c.full_name}</td>
              <td className="border p-2">{c.sex}</td>
              <td className="border p-2">{c.district}</td>
              <td className="border p-2">{c.health_facility}</td>
              <td className="border p-2">{c.date_reported}</td>
              <td className="border p-2">{c.disease}</td>  
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;
