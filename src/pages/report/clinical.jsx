import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import api from '../../api/api';    
import html2pdf from 'html2pdf.js';


const ClinicalReportPage = () => {
  const [cases, setCases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtered, setFiltered] = useState([]);   
  const reportRef = useRef();

  useEffect(() => {
    api.get('/clinical/').then((res) => {
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
      filename: 'idsr_clinical_report.pdf',
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">IDSR Clinical Report</h2>
        <p><strong>Reporting Period:</strong> {startDate || 'N/A'} to {endDate || 'N/A'}</p>
        <p><strong>Total Cases Reported:</strong> {filtered.length}</p>

        {/* Section Tables */}
        {[
          { title: '1. Summary by Disease', key: 'disease' },      
          { title: '2. Case classification', key: 'case_classification' },
          { title: '3. Triage level', key: 'triage_level' },
          { title: '4. Diagnosis type', key: 'diagnosis_type' },   
          { title: '5. Admission status', key: 'admission_status' }, 
          { title: '6. Summary by Symptoms', key: 'symptoms' }, 
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

       

      </div>
    </div>
  );
};
    
export default ClinicalReportPage;     
