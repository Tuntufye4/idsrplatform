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
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  MapIcon,
  ChartBarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import api from '../api/api';

// ======================================================
// THEME
// ======================================================

const TEAL = '#14B8A6';
const DARK_TEAL = '#0F766E';
const LIGHT_TEAL = '#CCFBF1';
const CYAN = '#06B6D4';

const PIE_COLORS = [
  '#14B8A6',
  '#06B6D4',
  '#0F766E',
  '#2DD4BF',
  '#5EEAD4',
  '#0891B2',
  '#0E7490',
  '#67E8F9',
];

// ======================================================
// DASHBOARD
// ======================================================

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // ====================================================
  // FETCH CASES
  // ====================================================

  const fetchCases = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await api.get('cases/');
      const data = Array.isArray(response.data) ? response.data : [];

      setCases(data);
    } catch (err) {
      console.error('Error loading cases:', err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Unable to load surveillance cases.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // ====================================================
  // FILTER OPTIONS
  // ====================================================

  const years = useMemo(() => {
    return [
      ...new Set(
        cases
          .map((c) => c.reporting_year)
          .filter((value) => value !== null && value !== undefined && value !== '')
      ),
    ].sort((a, b) => String(b).localeCompare(String(a)));
  }, [cases]);

  const regions = useMemo(() => {
    return [
      ...new Set(
        cases
          .map((c) => c.region)
          .filter((value) => value !== null && value !== undefined && value !== '')
      ),
    ].sort();
  }, [cases]);

  // ====================================================
  // FILTER CASES
  // ====================================================

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchYear = yearFilter
        ? String(c.reporting_year) === String(yearFilter)
        : true;

      const matchSex = sexFilter
        ? String(c.sex || '').toLowerCase() === sexFilter.toLowerCase()
        : true;

      const matchRegion = regionFilter
        ? String(c.region || '').toLowerCase() === regionFilter.toLowerCase()
        : true;

      return matchYear && matchSex && matchRegion;
    });
  }, [cases, yearFilter, sexFilter, regionFilter]);

  // ====================================================
  // SUMMARY STATISTICS
  // ====================================================

  const totalCases = filteredCases.length;

  const totalDistricts = new Set(
    filteredCases
      .map((c) => c.district)
      .filter((value) => value !== null && value !== undefined && value !== '')
  ).size;

  const totalFacilities = new Set(
    filteredCases
      .map((c) => c.health_facility)
      .filter((value) => value !== null && value !== undefined && value !== '')
  ).size;

  const totalDiseases = new Set(
    filteredCases
      .map((c) => c.disease)
      .filter((value) => value !== null && value !== undefined && value !== '')
  ).size;

  // ====================================================
  // CASES OVER TIME
  // ====================================================

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

  // ====================================================
  // CASES BY DISEASE
  // ====================================================

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

  // ====================================================
  // CASES BY DISTRICT
  // ====================================================

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

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setYearFilter('');
    setSexFilter('');
    setRegionFilter('');
  };

  const hasFilters = yearFilter || sexFilter || regionFilter;

  // ====================================================
  // STAT CARD
  // ====================================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }) => {
    return (
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {title}
              </p>

              <p
                className="mt-2 text-3xl font-bold"
                style={{ color: DARK_TEAL }}
              >
                {value.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {description}
              </p>
            </div>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: LIGHT_TEAL,
                color: TEAL,
              }}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div
          className="h-1 w-full"
          style={{ backgroundColor: TEAL }}
        />
      </div>
    );
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto"
            style={{
              borderTopColor: TEAL,
            }}
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading surveillance data...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error && cases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <ChartBarIcon className="w-7 h-7" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={() => fetchCases()}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              <ArrowPathIcon className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN DASHBOARD
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: LIGHT_TEAL,
                color: TEAL,
              }}
            >
              <ChartBarIcon className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Surveillance Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Integrated Disease Surveillance and Response
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchCases(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-teal-700 hover:border-teal-200 shadow-sm transition disabled:opacity-60"
        >
          <ArrowPathIcon
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''
              }`}
          />

          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* =================================================
          ERROR BANNER
      ================================================= */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

        <StatCard
          title="Total Cases"
          value={totalCases}
          icon={ChartBarIcon}
          description={
            hasFilters
              ? 'Cases matching filters'
              : 'All reported cases'
          }
        />

        <StatCard
          title="Districts"
          value={totalDistricts}
          icon={MapIcon}
          description="Affected districts"
        />

        <StatCard
          title="Facilities"
          value={totalFacilities}
          icon={BuildingOffice2Icon}
          description="Reporting facilities"
        />

        <StatCard
          title="Diseases"
          value={totalDiseases}
          icon={FunnelIcon}
          description="Diseases recorded"
        />

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-7">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

          <div>
            <div className="flex items-center gap-2">
              <FunnelIcon
                className="w-5 h-5"
                style={{ color: TEAL }}
              />

              <h2 className="font-semibold text-gray-800">
                Filter Cases
              </h2>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Narrow the dashboard results by year, sex, or region.
            </p>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium hover:underline"
              style={{ color: DARK_TEAL }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Year */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Reporting Year
            </label>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            >
              <option value="">All Years</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Sex
            </label>

            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            >
              <option value="">All Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Region
            </label>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            >
              <option value="">All Regions</option>

              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Cases Over Time */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              Cases Over Time
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Reported cases by date
            </p>
          </div>

          <div className="h-[320px]">

            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No time-series data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow:
                        '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Cases"
                    stroke={TEAL}
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: TEAL,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* Districts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              Cases by District
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Distribution of reported cases
            </p>
          </div>

          <div className="h-[320px]">

            {districtData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No district data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={districtData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 45,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="district"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                    }}
                  />

                  <Bar
                    dataKey="count"
                    name="Cases"
                    fill={TEAL}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* Disease Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 xl:col-span-2">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              Disease Distribution
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Distribution of cases by disease
            </p>
          </div>

          <div className="h-[380px]">

            {diseaseData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No disease data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={diseaseData}
                    dataKey="count"
                    nameKey="disease"
                    cx="50%"
                    cy="50%"
                    outerRadius={125}
                    innerRadius={60}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ disease, percent }) =>
                      `${disease} ${(percent * 100).toFixed(0)}%`
                    }
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

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />

                </PieChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

      </div>

      {/* =================================================
          FOOTER SUMMARY
      ================================================= */}

      <div className="mt-7 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          <p className="text-sm text-gray-500">
            Showing{' '}
            <span
              className="font-bold"
              style={{ color: DARK_TEAL }}
            >
              {filteredCases.length.toLocaleString()}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-700">
              {cases.length.toLocaleString()}
            </span>{' '}
            cases
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: TEAL }}
            />

            Live surveillance data
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;