import React, { useEffect, useMemo, useState } from 'react';
import { getEpidemiology } from '../../api/api';

const EpidemiologyTable = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    getEpidemiology()
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error loading epidemiology:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEpidemiology = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((c) =>
      [
        c.patient_id,
        c.environmental_risk_factors,
        c.exposure_source,
        c.cluster_related,       
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [records, search]);

  const columns = [
    ['patient_id', 'Patient ID'],
    ['environmental_risk_factors', 'Environmental risk factors'],
    ['exposure_source', 'Exposure source'],
    ['cluster_related', 'Cluster related'],   
  ];

 return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
             Epidemiology   
          </h2>
          <p className="text-sm text-gray-500">
            Epidemiological details
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search epidemiological details..."
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
                {filteredEpidemiology.map((c, i) => (
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
         

        {!loading && filteredEpidemiology.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No epdiemiological records found.
          </div>
        )}    
      </div>
    </div>
  );   
};

export default EpidemiologyTable;             