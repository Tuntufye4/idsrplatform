import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import api from "../api/api";
   
const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);

  const [yearFilter, setYearFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    api.get('cases/').then(res => {
      setCases(res.data);
      setFilteredCases(res.data);
    });
  }, []);

  useEffect(() => {
    const filtered = cases.filter(c => {
      const matchYear = yearFilter ? c.reporting_year === yearFilter : true;
      const matchSex = sexFilter ? c.sex === sexFilter : true;
      const matchRegion = regionFilter ? c.region === regionFilter : true;
      return matchYear && matchSex && matchRegion;
    });
    setFilteredCases(filtered);
  }, [yearFilter, sexFilter, regionFilter, cases]);

  const totalCases = filteredCases.length;
  const totalDistricts = new Set(filteredCases.map(c => c.district)).size;
  const totalFacilities = new Set(filteredCases.map(c => c.health_facility)).size;

  const groupedByDate = filteredCases.reduce((acc, c) => {
    const date = c.date_reported || 'Unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupedByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const groupedByDisease = filteredCases.reduce((acc, c) => {
    const key = c.disease || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const diseaseData = Object.entries(groupedByDisease).map(
    ([disease, count]) => ({ disease, count })
  );

  const pieColors = [
    "#6366f1", "#34d399", "#f59e0b",
    "#ef4444", "#14b8a6", "#a855f7",
    "#3b82f6", "#ec4899"
  ];


  const groupedByDistrict = filteredCases.reduce((acc, c) => {
    const key = c.district || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const districtData = Object.entries(groupedByDistrict).map(([district, count]) => ({
    district,
    count
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm font-medium text-gray-500">Total Cases</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCases}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm font-medium text-gray-500">Districts</h3>
          <p className="text-3xl font-bold text-green-600">{totalDistricts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm font-medium text-gray-500">Facilities</h3>
          <p className="text-3xl font-bold text-yellow-600">{totalFacilities}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">
        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {[...new Set(cases.map(c => c.reporting_year))].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={sexFilter}
          onChange={e => setSexFilter(e.target.value)}
        >
          <option value="">All Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
        >
          <option value="">All Regions</option>
          {[...new Set(cases.map(c => c.region))].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Cases Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Cases by District</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districtData}>
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 mt-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Disease Distribution
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={diseaseData}
                dataKey="count"
                nameKey="disease"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {diseaseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
