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

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return records.filter((c) =>
      Object.values(c).some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [records, search]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
            Epidemiology
          </h2>
          <p className="text-sm text-gray-500">
            Epidemiological case information
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search epidemiological records..."
          className="w-full md:w-96 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-teal-50">
                <tr>
                  {Object.keys(filtered[0]).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase text-teal-700"
                    >
                      {key.replaceAll('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((record, index) => (
                  <tr
                    key={record.id ?? index}
                    className="hover:bg-teal-50/50"
                  >
                    {Object.keys(filtered[0]).map((key) => (
                      <td key={key} className="px-4 py-3">
                        {record[key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
      </div>
    </div>
  );
};

export default EpidemiologyTable;   