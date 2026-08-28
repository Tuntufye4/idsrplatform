import React, { useEffect, useMemo, useState } from 'react';
import { getCases } from '../../api/api';

const DemographicsTable = () => {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {                                              
    const loadCases = async () => {
      try {
        const res = await getCases();
        setCases(res.data);
      } catch (error) {
        console.error('Error loading demographics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  const filteredCases = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return cases;

    return cases.filter((c) =>
      [
        c.patient_id,      
        c.age,
        c.sex,
        c.village,
        c.district,   
        c.region,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [cases, search]);

  const columns = [
    ['patient_id', 'Patient ID'],
    ['age', 'Age'],
    ['sex', 'Sex'],
    ['village', 'Village'],
    ['district', 'District'],
    ['region', 'Region'],   
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
            Demographics
          </h2>         
          <p className="text-sm text-gray-500">
            Patient demographic information
          </p>
        </div>

        <input
          type="text"
          placeholder="Search clinical records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="px-5 py-4 border-b">    
          <span className="font-semibold text-gray-700">
            Demographic Records
          </span>
          <span className="ml-3 text-sm text-teal-600">
            {filteredCases.length} records
          </span>
        </div>

        
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
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
                {filteredCases.map((c, i) => (
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
        

        {!loading && filteredCases.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No cases found.
          </div>
        )}
      </div>
    </div>
  );
};
     
export default DemographicsTable;      