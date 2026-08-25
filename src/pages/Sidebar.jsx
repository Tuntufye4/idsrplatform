import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChartBarIcon,
  MapIcon,    
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

const TURQUOISE = '#14B8A6';
const DARK_TURQUOISE = '#0F766E';

const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: ChartBarIcon,
  },
  {
    path: '/map',
    label: 'Map',
    icon: MapIcon,
  },
  {
    label: 'Report Case',
    icon: DocumentTextIcon,
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
    icon: ClipboardDocumentListIcon,
    subItems: [
      { path: '/table/demographics', label: 'Demographics' },
      { path: '/table/lab', label: 'Lab' },
      { path: '/table/facility', label: 'Facility' },
      { path: '/table/clinical_details', label: 'Clinical Details' },
      { path: '/table/treatment', label: 'Treatment' },
      { path: '/table/surveillance_info', label: 'Surveillance Info' },
      { path: '/table/epidemiological', label: 'Epidemics Details' },
    ],
  },
  {
    label: 'Reports',
    icon: ChartPieIcon,
    subItems: [
      { path: '/report/clinical', label: 'Clinical' },
      { path: '/report/demographics', label: 'Demographics' },
      { path: '/report/lab', label: 'Lab' },
    ],
  },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu((current) => (current === label ? null : label));
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: '#CCFBF1',
              color: TURQUOISE,
            }}
          >
            <ChartBarIcon className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              IDSR
            </h1>
            <p className="text-xs text-gray-500">
              Disease Surveillance
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-5">
        <div className="border-t border-gray-200" />
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-5 space-y-2"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label || item.path}>
              {item.subItems ? (
                <div>
                  {/* Parent menu */}
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 ${openMenu === item.label
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-teal-700'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      {Icon && (
                        <Icon
                          className={`w-5 h-5 ${openMenu === item.label
                              ? 'text-teal-600'
                              : 'text-gray-400 group-hover:text-teal-600'
                            }`}
                        />
                      )}

                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>
                    </span>

                    {openMenu === item.label ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>

                  {/* Submenu */}
                  {openMenu === item.label && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-teal-100 space-y-1">
                      {item.subItems.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `relative flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive
                                ? 'bg-teal-50 text-teal-700 font-semibold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-teal-700'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <span
                                    className="absolute left-0 w-1 h-5 rounded-full"
                                    style={{
                                      backgroundColor: TURQUOISE,
                                    }}
                                  />
                                )}

                                <span className="ml-1">
                                  {sub.label}
                                </span>
                              </>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                      : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />

                  <span className="text-sm font-semibold">
                    {item.label}
                  </span>
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 p-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: TURQUOISE }}
            />

            <span className="text-xs font-medium text-teal-800">
              Surveillance System
            </span>
          </div>

          <p className="mt-1 ml-4 text-[11px] text-gray-500">
            Integrated Disease Surveillance
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;