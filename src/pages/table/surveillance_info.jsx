import React, { useEffect, useMemo, useState } from 'react';
import { getSurveillance } from '../../api/api';
          
const SurveillanceTable = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
         
  useEffect(() => {
    getSurveillance()
      .then((res) => setRecords(res.data))        
      .catch((err) => console.error('Error loading surveillance:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((c) =>   
      [
        c.patient_id,
        c.notifier_signature,
        c.reviewed_by,
        c.supervisor_comments,
        c.reporting_week,
        c.year,           
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )    
    );
  }, [records, search]);    

  const columns = [
    ['patient_id', 'Patient ID'],
    ['notifier_signature', 'Notifier'],                
    ['reviewed_by', 'Reviewed By'],
    ['supervisor_comments', 'Supervisor Comments'],
    ['reporting_week_number', 'Reporting week'],
    ['year', 'Year'],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
            Surveillance    
          </h2>
          <p className="text-sm text-gray-500">
            Surveillance and reporting information
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search surveillance..."
          className="w-full md:w-96 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
       
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-teal-50">
                <tr>
                  {columns.map(([key, label]) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase text-teal-700"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredRecords.map((c, i) => (
                  <tr key={c.id ?? i} className="hover:bg-teal-50/50">
                    {columns.map(([key]) => (
                      <td key={key} className="px-4 py-3">
                        {c[key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         

        {!loading && filteredRecords.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No surveillance records found.
          </div>
        )}    
      </div>
    </div>
  );   
};

export default SurveillanceTable;             