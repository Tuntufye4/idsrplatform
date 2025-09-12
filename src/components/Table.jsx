import React, { useEffect, useState } from "react";
import api from "../api/api";

const TablePage = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get("cases/").then((res) => setCases(res.data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* App Bar */}
      <header className="bg-white text-gray-800 px-6 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-xl font-bold">IDSR Dashboard</h1>
        <nav>
          <ul className="flex space-x-6">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">Table</li>
            <li className="hover:text-blue-600 cursor-pointer">Charts</li>
            <li className="hover:text-blue-600 cursor-pointer">Map</li>
          </ul>
        </nav>
      </header>

      {/* Table Content */}
      <main className="flex-1 p-6">
        <div className="overflow-x-auto">
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
                <tr key={i} className="hover:bg-gray-50">
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
      </main>
    </div>
  );
};

export default TablePage;
     