import React, { useEffect, useMemo, useState } from 'react';
import { getTreatment } from '../../api/api';
     
const TreatmentTable = () => {
  const [treatments, setTreatments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTreatment()
      .then((res) => setTreatments(res.data))
      .catch((err) => console.error('Error loading treatment:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return treatments.filter((c) =>
      Object.values(c).some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [treatments, search]);

  const columns = [
    ['patient_id', 'Patient ID'],
    ['treatment_given', 'Treatment'],
    ['medication', 'Medication'],
    ['dose', 'Dose'],
    ['treatment_outcome', 'Outcome'],
    ['treatment_status', 'Status'],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
            Treatment
          </h2>
          <p className="text-sm text-gray-500">
            Case treatment information
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search treatment records..."
          className="w-full md:w-96 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full">
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
                {filtered.map((c, i) => (
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
                

        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No treatment records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentTable;        