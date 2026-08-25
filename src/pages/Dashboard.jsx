import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,       
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

import {
  getCases,
  getClinical,
  getFacilities,
} from "../api/api";

// =====================================================
// THEME
// =====================================================

const TEAL = "#0f766e";
const TEAL_LIGHT = "#14b8a6";
const TEAL_DARK = "#115e59";

const PIE_COLORS = [
  "#0f766e",
  "#14b8a6",
  "#2dd4bf",
  "#5eead4",
  "#99f6e4",
  "#0d9488",
  "#134e4a",
  "#115e59",
];

// =====================================================
// HELPERS
// =====================================================

const getArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
};

const getValue = (obj, keys) => {
  for (const key of keys) {
    const value = obj?.[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "Unknown";
};

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [clinical, setClinical] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [yearFilter, setYearFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboard = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [casesResponse, clinicalResponse, facilitiesResponse] =
        await Promise.allSettled([
          getCases(),
          getClinical(),
          getFacilities(),
        ]);

      if (casesResponse.status === "fulfilled") {
        setCases(getArray(casesResponse.value));
      } else {
        console.error("Cases error:", casesResponse.reason);
      }

      if (clinicalResponse.status === "fulfilled") {
        setClinical(getArray(clinicalResponse.value));
      } else {
        console.error("Clinical error:", clinicalResponse.reason);
      }

      if (facilitiesResponse.status === "fulfilled") {
        setFacilities(getArray(facilitiesResponse.value));
      } else {
        console.error("Facilities error:", facilitiesResponse.reason);
      }

      if (
        casesResponse.status === "rejected" &&
        clinicalResponse.status === "rejected" &&
        facilitiesResponse.status === "rejected"
      ) {
        setErrorMessage("Unable to load dashboard data.");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      setErrorMessage("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // FILTER CASES
  // =====================================================

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const year = String(
        getValue(c, ["reporting_year", "year"])
      );

      const sex = String(
        getValue(c, ["sex", "gender"])
      );

      const region = String(
        getValue(c, ["region"])
      );

      const matchYear = yearFilter ? year === yearFilter : true;
      const matchSex = sexFilter
        ? sex.toLowerCase() === sexFilter.toLowerCase()
        : true;
      const matchRegion = regionFilter
        ? region.toLowerCase() === regionFilter.toLowerCase()
        : true;

      return matchYear && matchSex && matchRegion;
    });
  }, [cases, yearFilter, sexFilter, regionFilter]);

  // =====================================================
  // FILTER CLINICAL DATA
  // =====================================================

  const filteredClinical = useMemo(() => {
    if (!clinical.length) return [];

    return clinical.filter((item) => {
      const year = String(
        getValue(item, [
          "reporting_year",
          "year",
        ])
      );

      const sex = String(
        getValue(item, ["sex", "gender"])
      );

      const region = String(
        getValue(item, ["region"])
      );

      const matchYear = yearFilter ? year === yearFilter : true;

      const matchSex = sexFilter
        ? sex.toLowerCase() === sexFilter.toLowerCase()
        : true;

      const matchRegion = regionFilter
        ? region.toLowerCase() === regionFilter.toLowerCase()
        : true;

      return matchYear && matchSex && matchRegion;
    });
  }, [clinical, yearFilter, sexFilter, regionFilter]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalCases = filteredCases.length;

  const totalDistricts = useMemo(() => {
    return new Set(
      filteredCases
        .map((c) => getValue(c, ["district"]))
        .filter((value) => value !== "Unknown")
    ).size;
  }, [filteredCases]);

  const totalFacilities = facilities.length;

  // =====================================================
  // YEARS
  // =====================================================

  const years = useMemo(() => {
    return [
      ...new Set(
        cases
          .map((c) =>
            getValue(c, ["reporting_year", "year"])
          )
          .filter((year) => year !== "Unknown")
          .map(String)
      ),
    ].sort((a, b) => b.localeCompare(a));
  }, [cases]);

  // =====================================================
  // CASES OVER TIME
  // =====================================================

  const chartData = useMemo(() => {
    const grouped = filteredCases.reduce((acc, c) => {
      const date = getValue(c, [
        "date_reported",
        "reporting_date",
        "date",
      ]);

      if (!acc[date]) {
        acc[date] = 0;
      }

      acc[date] += 1;

      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );
  }, [filteredCases]);

  // =====================================================
  // DISEASE DATA
  // USE BOTH CASES + CLINICAL
  // =====================================================

  const diseaseData = useMemo(() => {
    const grouped = {};

    filteredCases.forEach((c) => {
      const disease = getValue(c, [
        "disease",
        "disease_name",
        "condition",
      ]);

      grouped[disease] = (grouped[disease] || 0) + 1;
    });

    filteredClinical.forEach((c) => {
      const disease = getValue(c, [
        "disease",
        "disease_name",
        "condition",
        "diagnosis",
      ]);

      /*
       * Only add clinical records when they contain
       * a meaningful disease value.
       */
      if (disease !== "Unknown") {
        grouped[disease] =
          (grouped[disease] || 0) + 1;
      }
    });

    return Object.entries(grouped)
      .map(([disease, count]) => ({
        disease,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases, filteredClinical]);

  // =====================================================
  // DISTRICT DATA
  // =====================================================

  const districtData = useMemo(() => {
    const grouped = filteredCases.reduce((acc, c) => {
      const district = getValue(c, ["district"]);

      acc[district] = (acc[district] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([district, count]) => ({
        district,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases]);

  // =====================================================
  // FACILITY DATA
  // =====================================================

  const facilityData = useMemo(() => {
    const grouped = {};

    /*
     * Prefer actual facility endpoint.
     */
    facilities.forEach((facility) => {
      const name = getValue(facility, [
        "name",
        "facility_name",
        "health_facility",
        "facility",
      ]);

      if (name !== "Unknown") {
        grouped[name] = grouped[name] || 0;
      }
    });

    /*
     * Count cases associated with facilities.
     */
    filteredCases.forEach((c) => {
      const facility = getValue(c, [
        "health_facility",
        "facility",
        "facility_name",
        "health_facility_name",
      ]);

      if (facility !== "Unknown") {
        grouped[facility] =
          (grouped[facility] || 0) + 1;
      }
    });

    return Object.entries(grouped)
      .map(([facility, count]) => ({
        facility,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [facilities, filteredCases]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <p className="text-sm font-medium text-teal-700">
            Integrated Disease Surveillance and Response
          </p>

          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Disease surveillance overview and reporting statistics
          </p>
        </div>

                
      </div>

      {/* ERROR */}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Cases
              </p>

              <p className="text-3xl font-bold text-teal-700 mt-1">
                {loading ? "—" : totalCases}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 text-xl">
              ✓
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Districts
              </p>

              <p className="text-3xl font-bold text-teal-700 mt-1">
                {loading ? "—" : totalDistricts}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 text-xl">
              ◉
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Health Facilities
              </p>

              <p className="text-3xl font-bold text-teal-700 mt-1">
                {loading ? "—" : totalFacilities}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 text-xl">
              +
            </div>
          </div>
        </div>

      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              Dashboard Filters
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Filter cases and clinical information
            </p>
          </div>

          {(yearFilter || sexFilter || regionFilter) && (
            <button
              onClick={() => {
                setYearFilter("");
                setSexFilter("");
                setRegionFilter("");
              }}
              className="text-sm text-teal-700 hover:text-teal-900 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Years</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Regions</option>

            {[
              ...new Set(
                cases
                  .map((c) => getValue(c, ["region"]))
                  .filter((r) => r !== "Unknown")
              ),
            ].map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* CASES OVER TIME */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

          <h2 className="text-lg font-semibold text-slate-800">
            Cases Over Time
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Reported cases by reporting date
          </p>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
              />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke={TEAL}
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CASES BY DISTRICT */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

          <h2 className="text-lg font-semibold text-slate-800">
            Cases by District
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Distribution of reported cases across districts
          </p>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={districtData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="district"
                tick={{ fontSize: 11 }}
                angle={-25}
                textAnchor="end"
                height={60}
              />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="count"
                fill={TEAL_LIGHT}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DISEASE DISTRIBUTION */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

          <h2 className="text-lg font-semibold text-slate-800">
            Disease Distribution
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Disease information from cases and clinical records
          </p>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>

              <Pie
                data={diseaseData}
                dataKey="count"
                nameKey="disease"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={55}
                paddingAngle={2}
                label
              >
                {diseaseData.map((entry, index) => (
                  <Cell
                    key={`disease-${index}`}
                    fill={
                      PIE_COLORS[
                        index % PIE_COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* FACILITIES */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

          <h2 className="text-lg font-semibold text-slate-800">
            Cases by Health Facility
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Facilities reporting cases
          </p>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={facilityData}
              layout="vertical"
              margin={{
                left: 20,
                right: 20,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                type="number"
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="facility"
                width={130}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill={TEAL}
                radius={[0, 6, 6, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* DATA STATUS */}

      <div className="mt-6 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-sm text-teal-800">
        Showing{" "}
        <strong>{filteredCases.length}</strong>{" "}
        cases,{" "}
        <strong>{filteredClinical.length}</strong>{" "}
        clinical records, and{" "}
        <strong>{facilities.length}</strong>{" "}
        health facilities.
      </div>

    </div>
  );
};

export default Dashboard;