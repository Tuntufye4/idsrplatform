import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DocumentChartBarIcon,
  TableCellsIcon,
  UserGroupIcon,
  BeakerIcon,
  BuildingOffice2Icon,
  HeartIcon,
  ShieldCheckIcon,    
  GlobeAltIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const tableItems = [
  {
    path: "/table/demographics",
    label: "Demographics",
    icon: UserGroupIcon,
  },
  {
    path: "/table/clinical_details",
    label: "Clinical Details",
    icon: HeartIcon,
  },
  {
    path: "/table/lab",
    label: "Laboratory",
    icon: BeakerIcon,
  },
  {
    path: "/table/facility",
    label: "Facility",
    icon: BuildingOffice2Icon,
  },
  {
    path: "/table/treatment",
    label: "Treatment",
    icon: ShieldCheckIcon,
  },
  {
    path: "/table/surveillance_info",
    label: "Surveillance",
    icon: TableCellsIcon,
  },
  {
    path: "/table/epidemiological",
    label: "Epidemiology",
    icon: GlobeAltIcon,
  },
];

const TableSidebar = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`
        min-h-screen
        bg-white
        border-r
        border-gray-200
        shadow-sm
        flex
        flex-col
        transition-all
        duration-300
        ease-in-out
        ${collapsed ? "w-20 px-3" : "w-64 px-5"}
        py-6
      `}
    >
      {/* Header */}
      <div
        className={`
          flex
          items-center
          mb-6
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#14B8A6]/10 shrink-0">
            <DocumentChartBarIcon className="w-6 h-6 text-[#14B8A6]" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                IDSR
              </h1>
   
            </div>
          )}
        </div>

        {/* Collapse */}
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="
              p-2
              rounded-lg
              text-gray-500
              hover:bg-[#14B8A6]/10
              hover:text-[#0F766E]
              transition-all
              duration-200
            "
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="
            mx-auto
            mb-5
            p-2
            rounded-lg
            text-gray-500
            hover:bg-[#14B8A6]/10
            hover:text-[#0F766E]
            transition-all
            duration-200
          "
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-5" />

      {/* Tables Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={collapsed ? "Tables" : undefined}
        aria-label="Toggle tables menu"
        className={`
          w-full
          flex
          items-center
          rounded-xl
          text-gray-700
          hover:bg-[#14B8A6]/10
          hover:text-[#0F766E]
          transition-all
          duration-200
          ${
            collapsed
              ? "justify-center px-2 py-3"
              : "justify-between px-3 py-3"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <TableCellsIcon className="w-5 h-5 shrink-0" />

          {!collapsed && (
            <span className="font-semibold">
              Tables
            </span>
          )}
        </div>

        {!collapsed &&
          (open ? (
            <ChevronDownIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          ))}
      </button>

      {/* Table Navigation */}
      {open && (
        <nav
          className={`
            mt-2
            space-y-1
            ${collapsed ? "px-0" : "ml-2"}
          `}
        >
          {tableItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  text-sm
                  transition-all
                  duration-200
                  ${
                    collapsed
                      ? "justify-center px-3 py-3"
                      : "px-4 py-2.5"
                  }
                  ${
                    isActive
                      ? "bg-[#14B8A6] text-white font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-[#14B8A6]/10 hover:text-[#0F766E]"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />

                {!collapsed && (
                  <span>{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Return to Dashboard */}       
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => navigate("/select")}
          title={collapsed ? "Return to Menu" : undefined}
          aria-label="Return to Menu"
          className={`
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            text-gray-600
            hover:bg-[#14B8A6]/10
            hover:text-[#0F766E]
            transition-all
            duration-200
            ${
              collapsed
                ? "justify-center px-3 py-3"
                : "px-4 py-3"
            }
          `}
        >
   

          {!collapsed && (
            <span className="font-medium">
              Return to Menu
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default TableSidebar;                       