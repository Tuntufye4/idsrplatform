// src/components/BaseReport.jsx   
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js';
import api from '../api/api';

const BaseReport = ({ title, endpoint, sections }) => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const reportRef = useRef();   

  // Fetch data from API endpoint
  useEffect(() => {
    api.get(endpoint).then((res) => {
      setRecords(res.data);
      setFiltered(res.data);
    });
  }, [endpoint]);

  // Filter data by date range   
  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = records.filter((r) => {
        const date = dayjs(r.date_reported || r.created_at);
        return date.isAfter(startDate) && date.isBefore(endDate);
      });
      setFiltered(filteredData);
    } else {
      setFiltered(records);
    }
  }, [startDate, endDate, records]);

  // Helpers
  const groupBy = (key) =>
    filtered.reduce((acc, curr) => {
      const val = curr[key] || 'Unknown';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const count = (conditionFn) => filtered.filter(conditionFn).length;

  const exportToPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={exportToPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Export to PDF
        </button>
      </div>

      {/* Report Body */}
      <div ref={reportRef} className="bg-white p-6 rounded-2xl shadow-md space-y-6 text-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
        <p><strong>Reporting Period:</strong> {startDate || 'N/A'} to {endDate || 'N/A'}</p>
        <p><strong>Total Records:</strong> {filtered.length}</p>

        {sections.map(({ title, key, type }) => (
          <div key={key}>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {type === 'table' ? (
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-1 text-gray-600">Category</th>
                    <th className="border px-3 py-1 text-gray-600">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupBy(key)).map(([k, v]) => (
                    <tr key={k} className="hover:bg-gray-50 transition">
                      <td className="border px-3 py-1">{k}</td>
                      <td className="border px-3 py-1">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <ul className="list-disc pl-6 space-y-1">
                {type === 'summary' && (
                  <>
                    <li>Positive: {count((r) => r.result?.toLowerCase() === 'positive')}</li>
                    <li>Negative: {count((r) => r.result?.toLowerCase() === 'negative')}</li>
                  </>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseReport;
