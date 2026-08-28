import React, { useEffect, useMemo, useState } from 'react';
import { getFacilities } from '../../api/api';

const FacilityTable = () => {           
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {         
    getFacilities()
      .then((res) => setFacilities(res.data))
      .catch((err) => console.error('Error loading facilities:', err))
      .finally(() => setLoading(false));
  }, []);        
        
  const filteredFacility = useMemo(() => {
    const query = search.toLowerCase().trim();

    return facilities.filter((c) =>
      [
        c.patient_id,
        c.health_facility_code,
        c.form_completed_by,
        c.case_source,
        c.reporting_method,         
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );   
  }, [facilities, search]);

  const columns = [
    ['patient_id', 'Patient ID'],   
    ['health_facility_code', 'Health Facility'],
    ['form_completed_by', 'Completed By'],
    ['case_source', 'Case source'],
    ['reporting_method', 'Reporting method'],   
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
                {filteredFacility.map((c, i) => (
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
        

        {!loading && filteredFacility.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No facility records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityTable;            