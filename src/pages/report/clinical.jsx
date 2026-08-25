import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import api from '../../api/api';
import html2pdf from 'html2pdf.js';    

const TEAL = '#0f766e';
const TEAL_LIGHT = '#ccfbf1';
const TEAL_DARK = '#115e59';

const ClinicalReportPage = () => {
  const [cases, setCases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reportRef = useRef(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await api.get('/clinical/');

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];

        setCases(data);
        setFiltered(data);
      } catch (err) {
        console.error('Clinical report error:', err);
        setError('Unable to load clinical report data.');
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  useEffect(() => {
    let filteredData = [...cases];

    if (startDate) {
      filteredData = filteredData.filter((c) => {
        if (!c.date_reported) return false;

        return !dayjs(c.date_reported).isBefore(
          dayjs(startDate).startOf('day')
        );
      });
    }

    if (endDate) {
      filteredData = filteredData.filter((c) => {
        if (!c.date_reported) return false;

        return !dayjs(c.date_reported).isAfter(
          dayjs(endDate).endOf('day')
        );
      });
    }

    setFiltered(filteredData);
  }, [startDate, endDate, cases]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const exportToPDF = () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 0.5,
      filename: 'idsr_clinical_report.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    html2pdf()
      .set(opt)
      .from(reportRef.current)
      .save();
  };

  const groupBy = (key) =>
    filtered.reduce((acc, curr) => {
      let value = curr[key];

      if (Array.isArray(value)) {
        value = value.join(', ');
      }

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ''
      ) {
        value = 'Unknown';
      }

      acc[value] = (acc[value] || 0) + 1;

      return acc;
    }, {});

  const reportSections = [
    {
      title: '1. Summary by Disease',
      key: 'disease',
    },
    {
      title: '2. Case Classification',
      key: 'case_classification',
    },
    {
      title: '3. Triage Level',
      key: 'triage_level',
    },
    {
      title: '4. Diagnosis Type',
      key: 'diagnosis_type',
    },
    {
      title: '5. Admission Status',
      key: 'admission_status',
    },
    {
      title: '6. Summary by Symptoms',
      key: 'symptoms',
    },
  ];

  const getDateRangeLabel = () => {
    if (startDate && endDate) {
      return `${startDate} to ${endDate}`;
    }

    if (startDate) {
      return `From ${startDate}`;
    }

    if (endDate) {
      return `Up to ${endDate}`;
    }

    return 'All available dates';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: TEAL }}
              >
                <span className="text-xl font-bold">+</span>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Clinical Report
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Integrated Disease Surveillance and Response
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={exportToPDF}
            disabled={loading || filtered.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: TEAL }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = TEAL_DARK;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = TEAL;
            }}
          >
            <span>↓</span>
            Export PDF
          </button>

        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">

        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: TEAL_LIGHT, color: TEAL_DARK }}
          >
            📅
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Reporting Period
            </h2>

            <p className="text-xs text-slate-500">
              Filter clinical cases by reporting date
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none transition focus:ring-2"
              style={{
                '--tw-ring-color': TEAL,
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none transition focus:ring-2"
              style={{
                '--tw-ring-color': TEAL,
              }}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Clear Filters
            </button>
          </div>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div
            className="w-10 h-10 border-4 border-slate-200 rounded-full mx-auto mb-4 animate-spin"
            style={{
              borderTopColor: TEAL,
            }}
          />

          <p className="text-slate-500">
            Loading clinical report...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm text-slate-500">
                Total Cases
              </p>

              <p
                className="text-3xl font-bold mt-1"
                style={{ color: TEAL }}
              >
                {filtered.length}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Cases in selected period
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm text-slate-500">
                Diseases Reported
              </p>

              <p
                className="text-3xl font-bold mt-1"
                style={{ color: TEAL }}
              >
                {Object.keys(groupBy('disease')).length}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Unique disease categories
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm text-slate-500">
                Reporting Period
              </p>

              <p className="text-lg font-bold text-slate-800 mt-2">
                {getDateRangeLabel()}
              </p>
            </div>

          </div>

          {/* Report */}
          <div
            ref={reportRef}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-8"
          >

            {/* PDF Header */}
            <div
              className="pb-5 mb-6 border-b"
              style={{ borderColor: TEAL_LIGHT }}
            >
              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: TEAL_DARK }}
                  >
                    IDSR Clinical Report
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Integrated Disease Surveillance and Response
                  </p>
                </div>

                <div
                  className="hidden md:block px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: TEAL_LIGHT,
                    color: TEAL_DARK,
                  }}
                >
                  Clinical Surveillance
                </div>

              </div>
            </div>

            {/* Report Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-sm">

              <div className="bg-slate-50 rounded-xl p-4">
                <span className="text-slate-500">
                  Reporting Period
                </span>

                <div className="font-semibold text-slate-800 mt-1">
                  {getDateRangeLabel()}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <span className="text-slate-500">
                  Total Cases Reported
                </span>

                <div
                  className="font-bold text-lg mt-1"
                  style={{ color: TEAL }}
                >
                  {filtered.length}
                </div>
              </div>

            </div>

            {/* Tables */}
            <div className="space-y-8">

              {reportSections.map(({ title, key }) => {
                const grouped = groupBy(key);
                const entries = Object.entries(grouped);

                return (
                  <section key={key}>

                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ backgroundColor: TEAL }}
                      />

                      <h3 className="text-lg font-semibold text-slate-800">
                        {title}
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">

                      <table className="w-full text-sm">

                        <thead
                          style={{
                            backgroundColor: TEAL_LIGHT,
                          }}
                        >
                          <tr>
                            <th
                              className="px-4 py-3 text-left font-semibold"
                              style={{ color: TEAL_DARK }}
                            >
                              Category
                            </th>

                            <th
                              className="px-4 py-3 text-right font-semibold"
                              style={{ color: TEAL_DARK }}
                            >
                              Cases
                            </th>
                          </tr>
                        </thead>

                        <tbody>

                          {entries.length > 0 ? (
                            entries.map(([category, value]) => (
                              <tr
                                key={category}
                                className="border-t border-slate-100 hover:bg-slate-50 transition"
                              >
                                <td className="px-4 py-3 text-slate-700">
                                  {category}
                                </td>

                                <td
                                  className="px-4 py-3 text-right font-semibold"
                                  style={{ color: TEAL }}
                                >
                                  {value}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="2"
                                className="px-4 py-6 text-center text-slate-400"
                              >
                                No data available
                              </td>
                            </tr>
                          )}

                        </tbody>

                      </table>

                    </div>
                  </section>
                );
              })}

            </div>

            {/* Footer */}
            <div className="mt-8 pt-5 border-t border-slate-200 text-xs text-slate-400 flex justify-between">
              <span>
                IDSR Surveillance System
              </span>

              <span>
                Total cases: {filtered.length}
              </span>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default ClinicalReportPage;