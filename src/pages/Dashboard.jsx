import React, { useEffect, useMemo, useState } from 'react';
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
  CartesianGrid,
  Legend,
} from 'recharts';
import api from '../api/api';

const PRIMARY = '#0f766e';
const PRIMARY_LIGHT = '#14b8a6';
const CYAN = '#06b6d4';

const PIE_COLORS = [
  '#0f766e',
  '#14b8a6',
  '#2dd4bf',
  '#06b6d4',
  '#0891b2',
  '#115e59',
  '#5eead4',
  '#0e7490',
];

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('cases/');

        setCases(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error loading cases:', err);
        setError('Unable to load surveillance data.');
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  // ============================================================
  // FILTER OPTIONS
  // ============================================================

  const years = useMemo(() => {
    return [
      ...new Set(
        cases
          .map((c) => c.reporting_year)
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              value !== ''
          )
      ),
    ].sort((a, b) => Number(b) - Number(a));
  }, [cases]);

  const regions = useMemo(() => {
    return [
      ...new Set(
        cases
          .map((c) => c.region)
          .filter(Boolean)
      ),
    ].sort();
  }, [cases]);

  // ============================================================
  // FILTER DATA
  // ============================================================

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesYear = yearFilter
        ? String(c.reporting_year) === String(yearFilter)
        : true;

      const matchesSex = sexFilter
        ? c.sex === sexFilter
        : true;

      const matchesRegion = regionFilter
        ? c.region === regionFilter
        : true;

      return matchesYear && matchesSex && matchesRegion;
    });
  }, [cases, yearFilter, sexFilter, regionFilter]);

  // ============================================================
  // SUMMARY
  // ============================================================

  const totalCases = filteredCases.length;

  const totalDistricts = new Set(
    filteredCases
      .map((c) => c.district)
      .filter(Boolean)
  ).size;

  const totalFacilities = new Set(
    filteredCases
      .map((c) => c.health_facility)
      .filter(Boolean)
  ).size;

  // ============================================================
  // CASES OVER TIME
  // ============================================================

  const chartData = useMemo(() => {
    const grouped = filteredCases.reduce((acc, c) => {
      const date = c.date_reported || 'Unknown';

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => {
        if (a.date === 'Unknown') return 1;
        if (b.date === 'Unknown') return -1;

        return new Date(a.date) - new Date(b.date);
      });
  }, [filteredCases]);

  // ============================================================
  // DISEASE DATA
  // ============================================================

  const diseaseData = useMemo(() => {
    const grouped = filteredCases.reduce((acc, c) => {
      const disease = c.disease || 'Unknown';

      acc[disease] = (acc[disease] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([disease, count]) => ({
        disease,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCases]);

  // ============================================================
  // DISTRICT DATA
  // ============================================================

  const districtData = useMemo(() => {
    const grouped = filteredCases.reduce((acc, c) => {
      const district = c.district || 'Unknown';

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

  // ============================================================
  // RESET FILTERS
  // ============================================================

  const resetFilters = () => {
    setYearFilter('');
    setSexFilter('');
    setRegionFilter('');
  };

  const hasFilters =
    yearFilter ||
    sexFilter ||
    regionFilter;

  // ============================================================
  // CUSTOM TOOLTIP
  // ============================================================

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="bg-white border border-teal-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-slate-500 mb-1">
          {label}
        </p>

        <p className="text-lg font-bold text-teal-700">
          {payload[0].value}
        </p>

        <p className="text-xs text-slate-400">
          Cases
        </p>
      </div>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

 

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center shadow-sm">
              <span className="text-xl text-white">
                🏥
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                IDSR Dashboard
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Integrated Disease Surveillance & Response
              </p>
            </div>
          </div>
        </div>

        {/* System status */}
        <div className="flex items-center gap-2 bg-white border border-teal-100 px-4 py-2.5 rounded-full shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-600" />
          </span>

          <span className="text-sm font-medium text-teal-700">
            System Online
          </span>
        </div>
      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-red-700">
              Unable to load data
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-7">

        {/* Cases */}
        <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-teal-600" />

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Cases
              </p>

              <p className="text-3xl font-bold text-teal-700 mt-2">
                {totalCases.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Reported surveillance cases
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-2xl">
                🩺
              </span>
            </div>
          </div>
        </div>

        {/* Districts */}
        <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-cyan-600" />

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Districts
              </p>

              <p className="text-3xl font-bold text-cyan-700 mt-2">
                {totalDistricts.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Districts reporting cases
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-2xl">
                📍
              </span>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="h-1 bg-teal-500" />

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Facilities
              </p>

              <p className="text-3xl font-bold text-teal-600 mt-2">
                {totalFacilities.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Health facilities reporting
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-2xl">
                🏨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FILTER PANEL
      ======================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-7">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <span>
                ⚙️
              </span>
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Surveillance Filters
              </h2>

              <p className="text-xs text-slate-400">
                Refine the displayed surveillance data
              </p>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-teal-700 hover:text-teal-900 transition"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              Reporting Year
            </label>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
            >
              <option value="">
                All Years
              </option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              Sex
            </label>

            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
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
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              Region
            </label>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
            >
              <option value="">
                All Regions
              </option>

              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter result */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-bold text-teal-700">
              {filteredCases.length.toLocaleString()}
            </span>{' '}
            of{' '}
            <span className="font-bold text-slate-700">
              {cases.length.toLocaleString()}
            </span>{' '}
            cases
          </p>

          {hasFilters && (
            <div className="flex flex-wrap gap-2">
              {yearFilter && (
                <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                  Year: {yearFilter}
                </span>
              )}

              {sexFilter && (
                <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">
                  Sex: {sexFilter}
                </span>
              )}

              {regionFilter && (
                <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                  Region: {regionFilter}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          CHART GRID
      ======================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ======================================================
            CASES OVER TIME
        ====================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Cases Over Time
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Trend of reported cases
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              📈
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              No time-series data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fill: '#64748b',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: '#64748b',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="count"
                  name="Cases"
                  stroke={PRIMARY}
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: PRIMARY,
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 6,
                    fill: TEAL,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ======================================================
            DISTRICT CHART
        ====================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Cases by District
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Geographic distribution
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              📍
            </div>
          </div>

          {districtData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              No district data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={districtData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="district"
                  tick={{
                    fill: '#64748b',
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: '#64748b',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="count"
                  name="Cases"
                  fill={PRIMARY_LIGHT}
                  radius={[7, 7, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ======================================================
            DISEASE DISTRIBUTION
        ====================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 xl:col-span-2">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Disease Distribution
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Distribution of reported diseases
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              🦠
            </div>
          </div>

          {diseaseData.length === 0 ? (
            <div className="h-[360px] flex items-center justify-center text-sm text-slate-400">
              No disease data available
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={diseaseData}
                    dataKey="count"
                    nameKey="disease"
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={125}
                    paddingAngle={3}
                    label
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          PIE_COLORS[
                          index % PIE_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #ccfbf1',
                      boxShadow:
                        '0 8px 25px rgba(15, 118, 110, 0.12)',
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Disease list */}
              <div className="space-y-3">

                {diseaseData
                  .slice(0, 8)
                  .map((item, index) => {
                    const percentage =
                      totalCases > 0
                        ? (
                          (item.count / totalCases) *
                          100
                        ).toFixed(1)
                        : 0;

                    return (
                      <div
                        key={item.disease}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 transition"
                      >
                        <div className="flex items-center justify-between mb-2">

                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  PIE_COLORS[
                                  index %
                                  PIE_COLORS.length
                                  ],
                              }}
                            />

                            <span className="text-sm font-medium text-slate-700">
                              {item.disease}
                            </span>
                          </div>

                          <span className="text-sm font-bold text-teal-700">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                PIE_COLORS[
                                index %
                                PIE_COLORS.length
                                ],
                            }}
                          />
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                          {percentage}% of total cases
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <p>
          IDSR Surveillance Dashboard
        </p>

        <p>
          Showing {filteredCases.length.toLocaleString()} filtered cases
        </p>
      </div>
    </div>
  );
};

export default Dashboard;