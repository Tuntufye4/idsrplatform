import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
import { getLab } from "../../api/api";

const TEAL = "#14B8A6";
const DARK_TEAL = "#0F766E";

const LabReport = () => {
  const [cases, setCases] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reportRef = useRef(null);

  useEffect(() => {
    loadLabData();
  }, []);

  const loadLabData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLab();
      setCases(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Lab report error:", err);
      setError("Unable to load laboratory data.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = cases.filter((item) => {
    if (!item.date_reported) return !startDate && !endDate;

    const date = dayjs(item.date_reported);

    const afterStart = startDate
      ? date.isSame(dayjs(startDate), "day") ||
      date.isAfter(dayjs(startDate), "day")
      : true;

    const beforeEnd = endDate
      ? date.isSame(dayjs(endDate), "day") ||
      date.isBefore(dayjs(endDate), "day")
      : true;

    return afterStart && beforeEnd;
  });

  const groupBy = (key) =>
    filtered.reduce((acc, item) => {
      const value =
        item[key] === null ||
          item[key] === undefined ||
          item[key] === ""
          ? "Unknown"
          : String(item[key]);

      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

  const exportToPDF = () => {
    if (!reportRef.current) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "idsr_lab_report.pdf",
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(reportRef.current)
      .save();
  };

  const sections = [
    {
      title: "Specimen Collected",
      key: "specimen_collected",
    },
    {
      title: "Specimen Type",
      key: "specimen_type",
    },
    {
      title: "Specimen Sent to Laboratory",
      key: "specimen_sent_to_lab",
    },
    {
      title: "Laboratory Result",
      key: "lab_result",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Laboratory Report
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Laboratory specimen and result surveillance summary.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5
                         focus:border-[#14B8A6]
                         focus:ring-2 focus:ring-[#14B8A6]/20
                         outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5
                         focus:border-[#14B8A6]
                         focus:ring-2 focus:ring-[#14B8A6]/20
                         outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="flex-1 rounded-xl border border-gray-200
                         px-4 py-2.5 font-medium text-gray-600
                         hover:bg-gray-50"
            >
              Clear
            </button>

            <button
              onClick={exportToPDF}
              className="flex-1 rounded-xl px-4 py-2.5 text-white
                         font-semibold hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Report */}
      <div
        ref={reportRef}
        className="bg-white rounded-2xl shadow-sm p-5 md:p-8"
      >
        <div
          className="border-b pb-5 mb-7"
          style={{ borderColor: `${TEAL}40` }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: DARK_TEAL }}
          >
            IDSR Laboratory Report
          </h2>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <p>
              <strong>Reporting Period:</strong>{" "}
              {startDate || "All dates"} — {endDate || "All dates"}
            </p>

            <p>
              <strong>Total Laboratory Records:</strong>{" "}
              <span className="font-bold" style={{ color: DARK_TEAL }}>
                {filtered.length}
              </span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading laboratory data...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-10 text-center text-gray-500">
            No laboratory records found for the selected period.
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map(({ title, key }, index) => {
              const data = groupBy(key);

              return (
                <section key={key}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-white font-bold text-sm"
                      style={{ backgroundColor: TEAL }}
                    >
                      {index + 1}
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                      {title}
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: `${TEAL}12` }}>
                          <th className="px-4 py-3 text-left font-semibold">
                            Category
                          </th>

                          <th className="px-4 py-3 text-left font-semibold">
                            Cases
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {Object.entries(data)
                          .sort((a, b) => b[1] - a[1])
                          .map(([category, count]) => (
                            <tr
                              key={category}
                              className="border-t border-gray-100 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3">
                                {category}
                              </td>

                              <td className="px-4 py-3 font-semibold">
                                {count}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabReport;             