import React, { useEffect, useMemo, useState } from 'react';
import { getClinical } from '../../api/api';

const ClinicalTable = () => {
  const [clinical, setClinical] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClinical = async () => {
      try {
        const res = await getClinical();
        setClinical(res.data);
      } catch (error) {
        console.error('Error loading clinical data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClinical();
  }, []);

  const filteredClinical = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return clinical;

    return clinical.filter((c) =>
      [
        c.patient_id,   
        c.disease,
        c.symptoms,
        c.case_classification,
        c.triage_level,
        c.admission_status,
        c.diagnosis_type,
        c.final_case_classification,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [clinical, search]);

  const columns = [
    ['patient_id', 'Patient ID'],
    ['disease', 'Disease'],
    ['case_classification', 'Case Classification'],
    ['symptoms', 'Symptoms'],
    ['triage_level', 'Triage'],
    ['admission_status', 'Admission'],
    ['diagnosis_type', 'Diagnosis'],
    ['final_case_classification', 'Final Classification'],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-teal-700">
            Clinical Details
          </h2>
          <p className="text-sm text-gray-500">
            Clinical case information
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
                {filteredClinical.map((c, i) => (
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
        

        {!loading && filteredClinical.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No clinical details found.
          </div>
        )}
      </div>
    </div>
  );
};
     
export default ClinicalTable;      