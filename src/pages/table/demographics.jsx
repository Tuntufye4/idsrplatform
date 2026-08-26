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
        c.id,
        c.full_name,
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
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
          placeholder="Search patient, sex, village, district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:w-96 px-4 py-2.5
            border border-gray-200 rounded-xl
            bg-white shadow-sm
            focus:outline-none focus:ring-2 focus:ring-teal-500
          "
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b flex justify-between">
          <span className="font-semibold text-gray-700">
            Patient Records
          </span>

          <span className="text-sm text-teal-700 font-medium">
            {filteredCases.length} records
          </span>
        </div>

        
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-teal-50">
                <tr>
                  {[
                    'ID',
                    'Patient',
                    'Age',
                    'Sex',
                    'Village',
                    'District',
                    'Region',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase text-teal-700"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCases.map((c, index) => (
                  <tr
                    key={c.id ?? index}
                    className="hover:bg-teal-50/50 transition"
                  >
                    <td className="px-4 py-3">{c.id ?? '-'}</td>
                    <td className="px-4 py-3 font-medium">
                      {c.full_name ?? c.patient_id ?? '-'}
                    </td>
                    <td className="px-4 py-3">{c.age ?? '-'}</td>
                    <td className="px-4 py-3">{c.sex ?? '-'}</td>
                    <td className="px-4 py-3">{c.village ?? '-'}</td>
                    <td className="px-4 py-3">{c.district ?? '-'}</td>
                    <td className="px-4 py-3">{c.region ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
                

        {!loading && filteredCases.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No demographic records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DemographicsTable;    