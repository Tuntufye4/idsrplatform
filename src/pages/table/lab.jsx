import React, { useEffect, useMemo, useState } from 'react';
import { getLab } from '../../api/api';

const LabTable = () => {
  const [labs, setLabs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
                                     
  useEffect(() => {
    const loadLabs = async () => {
      try {
        const res = await getLab();
        setLabs(res.data);
      } catch (error) {
        console.error('Error loading laboratory data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLabs();
  }, []);

  const filteredLabs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return labs.filter((c) =>
      [
        c.patient_id,
        c.specimen_collected,
        c.specimen_type,
        c.specimen_sent_to_lab,
        c.lab_result,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [labs, search]);

  const columns = [
    ['patient_id', 'Patient ID'],
    ['specimen_collected', 'Specimen Collected'],
    ['specimen_type', 'Specimen Type'],
    ['specimen_sent_to_lab', 'Sent to Lab'],
    ['lab_result', 'Lab Result'],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
            Laboratory
          </h2>
          <p className="text-sm text-gray-500">
            Laboratory and specimen information
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search laboratory records..."
          className="w-full md:w-96 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
         
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full">
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
                {filteredLabs.map((c, i) => (
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
        

        {!loading && filteredLabs.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No laboratory records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default LabTable;