import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/map', label: 'Map' },
  {
    label: 'Report Case',
    subItems: [   
      { path: '/form/lab', label: 'Lab' },
      { path: '/form/facility', label: 'Facility' },
      { path: '/form/clinical_details', label: 'Clinical Details' },
      { path: '/form/demographics', label: 'Demographics' },
      { path: '/form/treatment', label: 'Treatment' },
      { path: '/form/surveillance_info', label: 'Surveillance Info' }, 
      { path: '/form/epidemiological', label: 'Epidemics Details' }, 
    ],
  },
  {   
    label: 'Cases List',
    subItems: [ 
      { path: '/table/demographics', label: 'Demographics'},  
      { path: '/table/lab', label: 'Lab' },   
      { path: '/table/facility', label: 'Facility' },
      { path: '/table/clinical_details', label: 'Clinical Details' },
      { path: '/table/treatment', label: 'Treatment' },
      { path: '/table/surveillance_info', label: 'Surveillance Info' },
      { path: '/table/epidemiological', label: 'Epidemics Details'}
    ],
  },
  { path: '/report', label: 'Report' },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg px-6 py-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <ChartBarIcon className="w-6 h-6 text-[#003366] mr-2" />
        <h1 className="text-2xl font-bold text-[#003366]">IDSR</h1>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* Navigation */}
      <nav className="flex flex-col gap-4" aria-label="Main navigation">
        {navItems.map((item) => (
          <div key={item.label || item.path}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-[#003366] hover:text-[#001f4d] transition-colors font-semibold"
                >
                  <span>{item.label}</span>
                  {openMenu === item.label ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>

                {openMenu === item.label && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((sub) => (
                      <li key={sub.path}>
                        <NavLink
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-3 py-1 rounded-md text-sm text-[#003366] hover:bg-gray-100 ${
                              isActive
                                ? 'font-semibold text-[#001f4d] bg-gray-100'
                                : ''
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-[#003366] hover:text-[#001f4d] transition-colors ${
                    isActive ? 'font-semibold text-[#001f4d]' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
