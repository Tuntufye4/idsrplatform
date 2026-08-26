// src/pages/select.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ChartBarIcon,
    MapIcon,
    TableCellsIcon,
    DocumentChartBarIcon,
    ArrowRightIcon,
    ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../api/api";

const SelectPage = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: "Dashboard",
            description: "View IDSR statistics, diseases, facilities and trends.",
            path: "/dashboard",
            icon: ChartBarIcon,
        },
        {
            title: "Map",
            description: "View reported cases geographically across Malawi.",
            path: "/map",
            icon: MapIcon,
        },
        {
            title: "Tables / Lists",
            description: "Browse, search and review detailed case information.",
            path: "/table",
            icon: TableCellsIcon,         
        },
        {
            title: "Reports",
            description:
                "Generate clinical, demographic and laboratory reports.",
            path: "/report",
            icon: DocumentChartBarIcon,
        },
    ];

    const handleLogout = () => {   
        logoutUser();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-teal-100 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 shadow-md">
                            <ChartBarIcon className="h-6 w-6 text-white" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-800">
                                IDSR
                            </h1>

                            <p className="hidden text-xs text-gray-500 sm:block">
                                Integrated Disease Surveillance & Response
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-md"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* ================= MAIN ================= */}
            <main className="px-6 py-10">
                <div className="mx-auto max-w-6xl">
                    {/* Welcome */}
                    <div className="mb-10 text-center">
                        

                        <p className="mt-2 text-gray-500">
                            Select an area to continue
                        </p>
                    </div>

                    {/* ================= SELECTION GRID ================= */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {options.map((option) => {
                            const Icon = option.icon;

                            return (
                                <button
                                    key={option.path}
                                    type="button"
                                    onClick={() => navigate(option.path)}
                                    className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                >
                                    {/* Icon */}
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 transition-all duration-300 group-hover:bg-teal-600">
                                        <Icon className="h-7 w-7 text-teal-600 transition-colors duration-300 group-hover:text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {option.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                                        {option.description}
                                    </p>

                                    {/* Open */}
                                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-teal-600">
                                        <span>Open</span>

                                           
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-xs text-gray-400">
                            Integrated Disease Surveillance and Response
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectPage;        