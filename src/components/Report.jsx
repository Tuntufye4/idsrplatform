// src/components/Report.jsx

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

  const groupBy = (key) => {
    return filtered.reduce((acc, curr) => {
      const val = curr[key] || 'Unknown';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  };

  const count = (conditionFn) => filtered.filter(conditionFn).length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">IDSR Report (Malawi)</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex items-end">
          <button onClick={exportToPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Export to PDF
          </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-white p-6 rounded shadow-md text-sm">
        <p><strong>Reporting Period:</strong> {startDate} to {endDate}</p>
        <p><strong>Total Cases Reported:</strong> {filtered.length}</p>

        <h3 className="text-lg mt-4 font-semibold">1. Summary by Disease</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">Disease</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {Object.entries(groupBy('disease')).map(([disease, count]) => (
              <tr key={disease}><td className="border p-1">{disease}</td><td className="border p-1">{count}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg mt-4 font-semibold">2. Cases by District</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">District</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {Object.entries(groupBy('district')).map(([d, count]) => (
              <tr key={d}><td className="border p-1">{d}</td><td className="border p-1">{count}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg mt-4 font-semibold">3. Sex Distribution</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">Sex</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {Object.entries(groupBy('sex')).map(([s, count]) => (
              <tr key={s}><td className="border p-1">{s}</td><td className="border p-1">{count}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg mt-4 font-semibold">4. Vaccination Status</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">Status</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {Object.entries(groupBy('vaccination_status')).map(([s, count]) => (
              <tr key={s}><td className="border p-1">{s}</td><td className="border p-1">{count}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg mt-4 font-semibold">5. Lab Testing</h3>
        <ul className="list-disc pl-6">
          <li>Specimens Collected: {count((c) => c.specimen_collected === 'Yes')}</li>
          <li>Lab Results - Positive: {count((c) => c.lab_result?.toLowerCase() === 'positive')}</li>
          <li>Lab Results - Negative: {count((c) => c.lab_result?.toLowerCase() === 'negative')}</li>
        </ul>

        <h3 className="text-lg mt-4 font-semibold">6. Outcome Distribution</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">Outcome</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {Object.entries(groupBy('outcome')).map(([o, count]) => (
              <tr key={o}><td className="border p-1">{o}</td><td className="border p-1">{count}</td></tr>
            ))}
          </tbody>
        </table>
  
        <h3 className="text-lg mt-4 font-semibold">7. Age Group Distribution</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">Age Group</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {[
              { label: '0-4 years', fn: (age) => age < 5 },
              { label: '5-14 years', fn: (age) => age >= 5 && age <= 14 },
              { label: '15-49 years', fn: (age) => age >= 15 && age <= 49 },
              { label: '50+ years', fn: (age) => age >= 50 }
            ].map(({ label, fn }) => {
              const countGroup = filtered.filter(c => fn(parseInt(c.age))).length;
              return <tr key={label}><td className="border p-1">{label}</td><td className="border p-1">{countGroup}</td></tr>;
            })}
          </tbody>
        </table>

        <h3 className="text-lg mt-4 font-semibold">8. Specimen Testing Overview</h3>
        <ul className="list-disc pl-6">
          <li>Specimens Sent to Lab: {count(c => c.specimen_sent_to_lab === 'Yes')}</li>
          <li>Pending Lab Results: {count(c => c.lab_result?.toLowerCase() === 'pending')}</li>
        </ul>

        <h3 className="text-lg mt-4 font-semibold">9. Top 5 Districts by Case Burden</h3>
        <table className="w-full border my-2 text-left">
          <thead><tr><th className="border p-1">District</th><th className="border p-1">Cases</th></tr></thead>
          <tbody>
            {Object.entries(groupBy('district'))
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([district, count]) => (
                <tr key={district}><td className="border p-1">{district}</td><td className="border p-1">{count}</td></tr>
              ))}
          </tbody>
        </table>


      </div>
    </div>
  );
};

export default Report;
