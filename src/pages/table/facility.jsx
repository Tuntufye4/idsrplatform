import React, { useEffect, useMemo, useState } from 'react';
import { getFacility } from '../../api/api';

const FacilityTable = () => {
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacility()
      .then((res) => setFacilities(res.data))
      .catch((err) => console.error('Error loading facilities:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return facilities.filter((c) =>
      Object.values(c).some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [facilities, search]);

  const columns = [
    ['patient_id', 'Patient ID'],
    ['health_facility', 'Health Facility'],
    ['facility_type', 'Facility Type'],
    ['district', 'District'],
    ['region', 'Region'],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">Facility</h2>
          <p className="text-sm text-gray-500">
            Health facility information
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search facilities..."
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
            No facility records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityTable;            