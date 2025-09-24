import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import api from '../api/api';
import html2pdf from 'html2pdf.js';

const Report = () => {
  const [cases, setCases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtered, setFiltered] = useState([]);
  const reportRef = useRef();

  useEffect(() => {
    api.get('/cases/').then((res) => {
      setCases(res.data);
      setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = cases.filter((c) => {
        const date = dayjs(c.date_reported);
        return date.isAfter(startDate) && date.isBefore(endDate);
      });
      setFiltered(filteredData);
    }
  }, [startDate, endDate, cases]);

  const exportToPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: 'idsr_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const groupBy = (key) =>
    filtered.reduce((acc, curr) => {
      const val = curr[key] || 'Unknown';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const count = (conditionFn) => filtered.filter(conditionFn).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">IDSR Report (Malawi)</h2>

      {/* Filters & Export */}
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
        <div>
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Export to PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="bg-white p-6 rounded-2xl shadow-md space-y-6 text-sm">
        <p><strong>Reporting Period:</strong> {startDate || 'N/A'} to {endDate || 'N/A'}</p>
        <p><strong>Total Cases Reported:</strong> {filtered.length}</p>

        {/* Section Tables */}
        {[
          { title: '1. Summary by Disease', key: 'disease' },
          { title: '2. Cases by District', key: 'district' },
          { title: '3. Sex Distribution', key: 'sex' },
          { title: '4. Vaccination Status', key: 'vaccination_status' },
          { title: '6. Outcome Distribution', key: 'outcome' },
        ].map(({ title, key }) => (
          <div key={key}>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-1 text-gray-600">Category</th>
                  <th className="border px-3 py-1 text-gray-600">Cases</th>
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
          </div>
        ))}

        {/* Lab Testing */}
        <div>
          <h3 className="text-lg font-semibold mb-2">5. Lab Testing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Specimens Collected: {count((c) => c.specimen_collected === 'Yes')}</li>
            <li>Lab Results - Positive: {count((c) => c.lab_result?.toLowerCase() === 'positive')}</li>
            <li>Lab Results - Negative: {count((c) => c.lab_result?.toLowerCase() === 'negative')}</li>
          </ul>
        </div>

        {/* Age Group Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-2">7. Age Group Distribution</h3>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-1 text-gray-600">Age Group</th>
                <th className="border px-3 py-1 text-gray-600">Cases</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '0-4 years', fn: (age) => age < 5 },
                { label: '5-14 years', fn: (age) => age >= 5 && age <= 14 },
                { label: '15-49 years', fn: (age) => age >= 15 && age <= 49 },
                { label: '50+ years', fn: (age) => age >= 50 },
              ].map(({ label, fn }) => {
                const countGroup = filtered.filter(c => fn(parseInt(c.age))).length;
                return (
                  <tr key={label} className="hover:bg-gray-50 transition">
                    <td className="border px-3 py-1">{label}</td>
                    <td className="border px-3 py-1">{countGroup}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Specimen Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-2">8. Specimen Testing Overview</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Specimens Sent to Lab: {count(c => c.specimen_sent_to_lab === 'Yes')}</li>
            <li>Pending Lab Results: {count(c => c.lab_result?.toLowerCase() === 'pending')}</li>
          </ul>
        </div>

        {/* Top 5 Districts */}
        <div>
          <h3 className="text-lg font-semibold mb-2">9. Top 5 Districts by Case Burden</h3>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-1 text-gray-600">District</th>
                <th className="border px-3 py-1 text-gray-600">Cases</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupBy('district'))
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([district, c]) => (
                  <tr key={district} className="hover:bg-gray-50 transition">
                    <td className="border px-3 py-1">{district}</td>
                    <td className="border px-3 py-1">{c}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Report;
