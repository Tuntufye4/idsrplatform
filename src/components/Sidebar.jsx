import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  ClipboardDocumentIcon,   
  TableCellsIcon,   
  DocumentChartBarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', label: 'Dashboard'},
  { path: '/map', label: 'Map'},
  { path: '/form', label: 'Report Case'},
  { path: '/table', label: 'Cases List'},   
  { path: '/report', label: 'Report'}
];    

const Sidebar = () => (
  <div className="w-64 h-screen bg-white shadow-md px-6 py-4">
    <div className="flex items-center space-x-2 mb-6">
      <ChartBarIcon className="w-6 h-6 text-[#003366]" />
      <h1 className="text-xl font-bold text-[#003366]">IDSR</h1>
    </div>

    <hr className="mb-6 border-t border-gray-300" />

    <nav className="flex flex-col gap-14" aria-label="Main navigation">
      {navItems.map(({ path, label, icon }) => (  
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center text-[#003366] hover:text-[#001f4d] transition-colors ${
              isActive ? 'font-semibold text-[#001f4d]' : ''
            }`
          }
          aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);
   
export default Sidebar;
