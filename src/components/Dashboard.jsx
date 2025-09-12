import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);

  const [yearFilter, setYearFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("cases/")
      .then((res) => {
        setCases(res.data);
        setFilteredCases(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cases:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = cases.filter((c) => {
      const matchYear = yearFilter ? c.reporting_year === yearFilter : true;
      const matchSex = sexFilter ? c.sex === sexFilter : true;
      const matchRegion = regionFilter ? c.region === regionFilter : true;
      return matchYear && matchSex && matchRegion;
    });
    setFilteredCases(filtered);
  }, [yearFilter, sexFilter, regionFilter, cases]);

  const totalCases = filteredCases.length;
  const totalDistricts = new Set(filteredCases.map((c) => c.district)).size;
  const totalFacilities = new Set(filteredCases.map((c) => c.health_facility)).size;

  const groupedByDate = filteredCases.reduce((acc, c) => {
    const date = c.date_reported || "Unknown";
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(groupedByDate).map(([date, count]) => ({ date, count }));

  const groupedByDistrict = filteredCases.reduce((acc, c) => {
    acc[c.district] = (acc[c.district] || 0) + 1;
    return acc;
  }, {});
  const districtData = Object.entries(groupedByDistrict).map(([district, count]) => ({
    district,
    count,
  }));

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">IDSR Dashboard</h1>
      </header>

      <main className="p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total Cases</h3>
            <p className="text-2xl">{totalCases}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Districts</h3>
            <p className="text-2xl">{totalDistricts}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Facilities</h3>
            <p className="text-2xl">{totalFacilities}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="p-2 border rounded"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {[...new Set(cases.map((c) => c.reporting_year))].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
          >
            <option value="">All Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            className="p-2 border rounded"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="">All Regions</option>
            {[...new Set(cases.map((c) => c.region))].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Charts in cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Cases Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Cases by District</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtData}>
                <XAxis dataKey="district" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
