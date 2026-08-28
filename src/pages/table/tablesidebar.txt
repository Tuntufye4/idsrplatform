import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    TableCellsIcon,
    UserGroupIcon,
    BeakerIcon,        
    BuildingOffice2Icon,
    HeartIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
} from '@heroicons/react/24/outline';

const tableItems = [
    {
        path: '/table/demographics',
        label: 'Demographics',
        icon: UserGroupIcon,
    },
    {
        path: '/table/clinical_details',
        label: 'Clinical Details',
        icon: HeartIcon,
    },
    {
        path: '/table/lab',
        label: 'Laboratory',
        icon: BeakerIcon,
    },
    {
        path: '/table/facility',
        label: 'Facility',
        icon: BuildingOffice2Icon,
    },
    {
        path: '/table/treatment',
        label: 'Treatment',
        icon: ShieldCheckIcon,
    },
    {
        path: '/table/surveillance_info',
        label: 'Surveillance',
        icon: TableCellsIcon,
    },
    {
        path: '/table/epidemiological',
        label: 'Epidemiology',
        icon: GlobeAltIcon,
    },
];

const TableSidebar = () => {
    const [open, setOpen] = useState(true);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
            {/* Header */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="
          w-full flex items-center justify-between
          px-5 py-4
          text-gray-800
          hover:bg-teal-50
          transition
        "
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                        <TableCellsIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="text-left">
                        <h2 className="font-semibold text-teal-700">
                            Cases List
                        </h2>
                        <p className="text-xs text-gray-400">
                            Data Tables
                        </p>
                    </div>
                </div>

                {open ? (
                    <ChevronDownIcon className="w-5 h-5 text-teal-600" />
                ) : (
                    <ChevronRightIcon className="w-5 h-5 text-teal-600" />
                )}
            </button>

            {/* Tables */}
            {open && (
                <nav className="px-3 pb-4 space-y-1">
                    {tableItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-xl
                  text-sm
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-teal-600 text-white font-semibold shadow-sm'
                                        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                                    }
                  `
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={`w-5 h-5 ${isActive
                                                    ? 'text-white'
                                                    : 'text-teal-600'
                                                }`}
                                        />

                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            )}
        </aside>
    );
};

export default TableSidebar;  