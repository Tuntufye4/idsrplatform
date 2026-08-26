import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

const reportItems = [
    {
        path: "/report/clinical",
        label: "Clinical Report",      
    },
    {
        path: "/report/demographics",
        label: "Demographics Report",
    },
    {
        path: "/report/lab",
        label: "Laboratory Report",
    },
];

const ReportSidebar = () => {
    const [open, setOpen] = useState(true);

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm px-5 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#14B8A6]/10">
                        <DocumentChartBarIcon className="w-6 h-6 text-[#14B8A6]" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            IDSR
                        </h1>
                        <p className="text-xs text-gray-500">
                            Reports
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-200 mb-5" />

            {/* Reports menu */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl
                   text-gray-700 hover:bg-[#14B8A6]/10 hover:text-[#0F766E]
                   transition-all duration-200"
            >
                <span className="font-semibold">Reports</span>

                {open ? (
                    <ChevronDownIcon className="w-5 h-5" />
                ) : (
                    <ChevronRightIcon className="w-5 h-5" />
                )}
            </button>

            {open && (
                <nav className="mt-2 ml-2 space-y-1">
                    {reportItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                block px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                ${isActive
                                    ? "bg-[#14B8A6] text-white font-semibold shadow-sm"
                                    : "text-gray-600 hover:bg-[#14B8A6]/10 hover:text-[#0F766E]"
                                }
                `
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            )}
        </aside>
    );
};

export default ReportSidebar;       