import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  getEpidemiology,
} from "../api/api";

// =====================================================
// THEME
// =====================================================

const TEAL = "#0f766e";
const TEAL_LIGHT = "#14b8a6";

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

const normalize = (value) => String(value).trim().toLowerCase();

const Dashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [cases, setCases] = useState([]);
  const [clinical, setClinical] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [epidemiology, setEpidemiology] = useState([]);

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
      const [
        casesResponse,
        clinicalResponse,
        facilitiesResponse,
        epidemiologyResponse,
      ] = await Promise.allSettled([
        getCases(),
        getClinical(),
        getFacilities(),
        getEpidemiology(),
      ]);

      let failedRequests = 0;

      // Cases
      if (casesResponse.status === "fulfilled") {
        setCases(getArray(casesResponse.value));
      } else {
        failedRequests += 1;
        console.error("Cases error:", casesResponse.reason);
      }

      // Clinical
      if (clinicalResponse.status === "fulfilled") {
        setClinical(getArray(clinicalResponse.value));
      } else {
        failedRequests += 1;
        console.error("Clinical error:", clinicalResponse.reason);
      }

      // Facilities
      if (facilitiesResponse.status === "fulfilled") {
        setFacilities(getArray(facilitiesResponse.value));
      } else {
        failedRequests += 1;
        console.error("Facilities error:", facilitiesResponse.reason);
      }

      // Epidemiology
      if (epidemiologyResponse.status === "fulfilled") {
        setEpidemiology(getArray(epidemiologyResponse.value));
      } else {
        failedRequests += 1;
        console.error(
          "Epidemiology error:",
          epidemiologyResponse.reason
        );
      }

      if (failedRequests === 4) {
        setErrorMessage("Unable to load dashboard data.");
      } else if (failedRequests > 0) {
        setErrorMessage(
          "Some dashboard data could not be loaded."
        );
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
    return cases.filter((item) => {
      const year = String(
        getValue(item, ["reporting_year", "year"])
      );

      const sex = String(
        getValue(item, ["sex", "gender"])
      );

      const region = String(
        getValue(item, ["region"])
      );

      const matchYear = yearFilter
        ? year === yearFilter
        : true;

      const matchSex = sexFilter
        ? normalize(sex) === normalize(sexFilter)
        : true;

      const matchRegion = regionFilter
        ? normalize(region) === normalize(regionFilter)
        : true;

      return matchYear && matchSex && matchRegion;
    });
  }, [cases, yearFilter, sexFilter, regionFilter]);

  // =====================================================
  // FILTER CLINICAL DATA
  // =====================================================

  const filteredClinical = useMemo(() => {
    return clinical.filter((item) => {
      const year = String(
        getValue(item, ["reporting_year", "year"])
      );

      const sex = String(
        getValue(item, ["sex", "gender"])
      );

      const region = String(
        getValue(item, ["region"])
      );

      const matchYear = yearFilter
        ? year === yearFilter
        : true;

      const matchSex = sexFilter
        ? normalize(sex) === normalize(sexFilter)
        : true;

      const matchRegion = regionFilter
        ? normalize(region) === normalize(regionFilter)
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
        .map((item) =>
          getValue(item, ["district"])
        )
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
          .map((item) =>
            getValue(item, [
              "reporting_year",
              "year",
            ])
          )
          .filter((year) => year !== "Unknown")
          .map(String)
      ),
    ].sort((a, b) => b.localeCompare(a));
  }, [cases]);

  // =====================================================
  // REGIONS
  // =====================================================

  const regions = useMemo(() => {
    const caseRegions = cases
      .map((item) =>
        getValue(item, ["region"])
      )
      .filter((region) => region !== "Unknown");

    const clinicalRegions = clinical
      .map((item) =>
        getValue(item, ["region"])
      )
      .filter((region) => region !== "Unknown");

    return [...new Set([
      ...caseRegions,
      ...clinicalRegions,
    ])].sort();
  }, [cases, clinical]);

  // =====================================================
  // CASES OVER TIME
  // =====================================================

  const chartData = useMemo(() => {
    const grouped = filteredCases.reduce((acc, item) => {
      const date = getValue(item, [
     
        "date_of_onset",

      ]);

      if (date === "Unknown") {
        return acc;
      }

      acc[date] = (acc[date] || 0) + 1;

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
  // =====================================================

  const diseaseData = useMemo(() => {
    const grouped = {};

    filteredCases.forEach((item) => {
      const disease = getValue(item, [
        "disease",
        "disease_name",
      ]);

      if (disease !== "Unknown") {
        grouped[disease] =
          (grouped[disease] || 0) + 1;
      }
    });

    filteredClinical.forEach((item) => {
      const disease = getValue(item, [
        "disease",
        "disease_name",
      ]);

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
    const grouped = filteredCases.reduce(
      (acc, item) => {
        const district = getValue(item, [
          "district",
        ]);

        acc[district] =
          (acc[district] || 0) + 1;

        return acc;
      },
      {}
    );

    return Object.entries(grouped)
      .filter(([district]) => district !== "Unknown")
      .map(([district, count]) => ({
        district,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases]);


   // =====================================================
  // Region Data
  // =====================================================
  const regionData = useMemo(() => {
    const grouped = filteredCases.reduce(
      (acc, item) => {
        const region = getValue(item, [
          "region",
        ]);

        acc[region] =
          (acc[region] || 0) + 1;

        return acc;
      },   
      {}
    );

    return Object.entries(grouped)
      .filter(([region]) => region !== "Unknown")
      .map(([region, count]) => ({
        region,
        count,    
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases]);

  // =====================================================
  // FACILITY DATA
  // =====================================================

  const facilityData = useMemo(() => {
    const grouped = filteredCases.reduce(
      (acc, item) => {
        const healthfacility = getValue(item, [
          "health_facility_code",
          "health_facility",
          "facility",
        ]);

        acc[healthfacility] =
          (acc[healthfacility] || 0) + 1;

        return acc;
      },
      {}
    );

    return Object.entries(grouped)
      .filter(([facility]) => facility !== "Unknown")
      .map(([healthfacility, count]) => ({
        healthfacility,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases]);

  // =====================================================
  // CASE CLASSIFICATION
  // =====================================================

  const caseClassificationData = useMemo(() => {
    const grouped = {};

    filteredCases.forEach((item) => {
      const classification = getValue(item, [
        "case_classification",
        "classification",
      ]);

      if (classification !== "Unknown") {
        grouped[classification] =
          (grouped[classification] || 0) + 1;
      }
    });

    filteredClinical.forEach((item) => {
      const classification = getValue(item, [
        "case_classification",
        "classification",
      ]);

      if (classification !== "Unknown") {
        grouped[classification] =
          (grouped[classification] || 0) + 1;
      }
    });

    return Object.entries(grouped)
      .map(([case_classification, count]) => ({
        case_classification,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases, filteredClinical]);

  // =====================================================
  // EPIDEMIOLOGY DATA
  // =====================================================

  const epidemiologyData = useMemo(() => {
    const grouped = {};

    epidemiology.forEach((item) => {
      const disease = getValue(item, [
        "disease",
        "disease_name",
      ]);

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
  }, [epidemiology]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setYearFilter("");
    setSexFilter("");
    setRegionFilter("");
  };

  const hasFilters =
    yearFilter ||
    sexFilter ||
    regionFilter;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() => navigate("/select")}
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-600
            shadow-sm
            transition-all
            duration-200
            hover:border-teal-200
            hover:bg-teal-50
            hover:text-teal-700
            hover:shadow
          "
        >
           Return to Menu
        </button>

        <div>
         

          <p className="mt-1 text-sm text-slate-500">
            Overview of reported cases, clinical records,
            facilities and epidemiological information.
          </p>
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {errorMessage && (
        <div className="
          mb-6
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
        ">
          {errorMessage}
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="
        mb-6
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        lg:grid-cols-3
      ">

        {/* Total Cases */}
        <div className="
          rounded-2xl
          border
          border-teal-100
          bg-white
          p-5
          shadow-sm
        ">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Cases
              </p>

              <p className="mt-1 text-3xl font-bold text-teal-700">
                {loading ? "—" : totalCases}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Reported surveillance cases
              </p>
            </div>

            <div className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-teal-50
              text-xl
              font-bold
              text-teal-700
            ">
              ✓
            </div>

          </div>
        </div>

        {/* Districts */}
        <div className="
          rounded-2xl
          border
          border-teal-100
          bg-white
          p-5
          shadow-sm
        ">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Districts
              </p>

              <p className="mt-1 text-3xl font-bold text-teal-700">
                {loading ? "—" : totalDistricts}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Districts represented in cases
              </p>
            </div>

            <div className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-teal-50
              text-xl
              font-bold
              text-teal-700
            ">
              ◉
            </div>

          </div>
        </div>

        {/* Facilities */}
        <div className="
          rounded-2xl
          border
          border-teal-100
          bg-white
          p-5
          shadow-sm
        ">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Health Facilities
              </p>

              <p className="mt-1 text-3xl font-bold text-teal-700">
                {loading ? "—" : totalFacilities}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Facilities in the system
              </p>
            </div>

            <div className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-teal-50
              text-xl
              font-bold
              text-teal-700
            ">
              +
            </div>

          </div>
        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="
        mb-6
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      ">

        <div className="
          mb-4
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <div>
          

            <p className="mt-1 text-xs text-slate-500">
              Filter cases and clinical information
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                self-start
                text-sm
                font-medium
                text-teal-700
                transition
                hover:text-teal-900
              "
            >
              Clear filters
            </button>
          )}

        </div>

        <div className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        ">

          {/* Year */}
          <div>
            <label className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-slate-600
            ">
              Reporting Year
            </label>

            <select
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-slate-700
                focus:border-teal-500
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500/20
              "
            >
              <option value="">
                All Years
              </option>

              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sex */}
          <div>
            <label className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-slate-600
            ">
              Sex
            </label>

            <select
              value={sexFilter}
              onChange={(e) =>
                setSexFilter(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-slate-700
                focus:border-teal-500
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500/20
              "
            >
              <option value="">
                All Sex
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-slate-600
            ">
              Region
            </label>

            <select
              value={regionFilter}
              onChange={(e) =>
                setRegionFilter(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-slate-700
                focus:border-teal-500
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500/20
              "
            >
              <option value="">
                All Regions
              </option>

              {regions.map((region) => (
                <option
                  key={region}
                  value={region}
                >
                  {region}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* =================================================
          CHART GRID
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-2
      ">

        {/* =================================================
            Cases By Region 
        ================================================= */}

       <div className="
          rounded-2xl
          border
          border-slate-200    
          bg-white
          p-5
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-slate-800">
            Cases by Region
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Distribution of reported cases across region
          </p>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart data={regionData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="region"
                tick={{ fontSize: 11 }}
                angle={-25}
                textAnchor="end"
                height={65}
              />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="count"
                name="Cases"
                fill={TEAL_LIGHT}
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>    

        </div>

     


        {/* =================================================
            CASES BY DISTRICT
        ================================================= */}

        <div className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-slate-800">
            Cases by District
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Distribution of reported cases across districts
          </p>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
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
                height={65}
              />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="count"
                name="Cases"
                fill={TEAL_LIGHT}
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* =================================================
            DISEASE DISTRIBUTION
        ================================================= */}

        <div className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-slate-800">
            Disease Distribution
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Disease information from cases and clinical records
          </p>

          {diseaseData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>

                <Pie
                  data={diseaseData}
                  dataKey="count"
                  nameKey="disease"
                  cx="50%"
                  cy="45%"
                  outerRadius={115}
                  innerRadius={55}
                  paddingAngle={2}
                  label
                >
                  {diseaseData.map(
                    (entry, index) => (
                      <Cell
                        key={`disease-${index}`}
                        fill={
                          PIE_COLORS[
                            index %
                              PIE_COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="
              flex
              h-[350px]
              items-center
              justify-center
              text-sm
              text-slate-400
            ">
              No disease data available.
            </div>
          )}

        </div>

        {/* =================================================
            CASE CLASSIFICATION
        ================================================= */}

        <div className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-slate-800">
            Case Classification
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Classification of reported cases
          </p>

          {caseClassificationData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>

                <Pie
                  data={caseClassificationData}
                  dataKey="count"
                  nameKey="case_classification"
                  cx="50%"
                  cy="45%"
                  outerRadius={115}
                  innerRadius={55}
                  paddingAngle={2}
                  label
                >
                  {caseClassificationData.map(
                    (entry, index) => (
                      <Cell
                        key={`classification-${index}`}
                        fill={
                          PIE_COLORS[
                            index %
                              PIE_COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="
              flex
              h-[350px]
              items-center
              justify-center
              text-sm
              text-slate-400
            ">
              No classification data available.
            </div>
          )}

        </div>

           
        {/* =================================================
            EPIDEMIOLOGY
        ================================================= */}

        {epidemiologyData.length > 0 && (
          <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            xl:col-span-2
          ">

            <h2 className="text-lg font-semibold text-slate-800">
              Epidemiological Overview
            </h2>

            <p className="mb-4 text-sm text-slate-500">
              Records available from the epidemiology dataset
            </p>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart data={epidemiologyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="disease"
                  tick={{ fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  height={65}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Records"
                  fill={TEAL_LIGHT}
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* =================================================
          DATA STATUS
      ================================================= */}

      <div className="
        mt-6
        rounded-xl
        border
        border-teal-100
        bg-teal-50
        px-4
        py-3
        text-sm
        text-teal-800
      ">

        Showing{" "}
        <strong>{filteredCases.length}</strong>{" "}
        cases,{" "}
        <strong>{filteredClinical.length}</strong>{" "}
        clinical records,{" "}
        <strong>{facilities.length}</strong>{" "}
        health facilities, and{" "}
        <strong>{epidemiology.length}</strong>{" "}
        epidemiological records.

      </div>

    </div>
  );
};

export default Dashboard;