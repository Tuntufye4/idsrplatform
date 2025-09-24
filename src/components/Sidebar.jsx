import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/map', label: 'Map'},
  { path: '/form', label: 'Report Case'},  
  { path: '/table', label: 'Cases List'},
  { path: '/report', label: 'Report'},
];

const Sidebar = () => (
  <div className="w-64 h-screen bg-white shadow-lg px-6 py-6 flex flex-col">
    {/* Logo */}
    <div className="flex items-center mb-8">
      <ChartBarIcon className="w-6 h-6 text-[#003366] mr-2" />
      <h1 className="text-2xl font-bold text-[#003366]">IDSR</h1>
    </div>

    <hr className="mb-6 border-gray-300" />

    {/* Navigation */}
    <nav className="flex flex-col gap-16" aria-label="Main navigation">
      {navItems.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg text-[#003366] transition-colors ${
              isActive ? 'bg-[#cce0ff] font-semibold text-[#001f4d]' : ''
            }`
          }
          aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
        >
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </div>
);

export default Sidebar;
         