import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

// =====================================================
// AUTH
// =====================================================
import Login from "./pages/login";
import Register from "./pages/register";

// =====================================================
// MAIN
// =====================================================
import Select from "./pages/select";
import Dashboard from "./pages/dashboard";
import MapView from "./pages/map";

// =====================================================
// TABLES
// =====================================================
import TableSidebar from "./pages/table/tablesidebar";
import DemographicsTable from "./pages/table/demographics";
import ClinicalTable from "./pages/table/clinical_details";
import LabTable from "./pages/table/lab";
import FacilityTable from "./pages/table/facility";
import TreatmentTable from "./pages/table/treatment";
import SurveillanceTable from "./pages/table/surveillance_info";
import EpidemiologicalTable from "./pages/table/epidemiological";

// =====================================================
// REPORTS
// =====================================================
import ReportSidebar from "./pages/report/reportsidebar";
import ClinicalReport from "./pages/report/clinical";
import DemographicsReport from "./pages/report/demographics";
import LabReport from "./pages/report/lab";

// =====================================================
// PRIVATE ROUTE
// =====================================================
function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =====================================================
// PUBLIC ROUTE
// =====================================================
function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// =====================================================
// TABLE LAYOUT
// Sidebar remains visible while table pages change
// =====================================================
function TableLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <TableSidebar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

// =====================================================
// REPORT LAYOUT
// Sidebar remains visible while report pages change
// =====================================================
function ReportLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <ReportSidebar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

// =====================================================
// APP
// =====================================================
export default function App() {
  return (
    <Routes>

      {/* =================================================
          AUTH
      ================================================= */}

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={   
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* =================================================
          HOME
      ================================================= */}

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Select />
          </PrivateRoute>
        }
      />

      {/* =================================================
          DASHBOARD
      ================================================= */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* =================================================
          MAP
      ================================================= */}

      <Route
        path="/map"
        element={
          <PrivateRoute>
            <MapView />
          </PrivateRoute>
        }
      />

      {/* =================================================
          TABLES
      ================================================= */}

      <Route
        path="/table"
        element={
          <PrivateRoute>
            <TableLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/table/demographics" replace />}
        />

        <Route
          path="demographics"
          element={<DemographicsTable />}
        />

        <Route
          path="clinical_details"
          element={<ClinicalTable />}
        />

        <Route
          path="lab"
          element={<LabTable />}
        />

        <Route
          path="facility"
          element={<FacilityTable />}
        />

        <Route
          path="treatment"
          element={<TreatmentTable />}
        />

        <Route
          path="surveillance_info"
          element={<SurveillanceTable />}
        />

        <Route
          path="epidemiological"
          element={<EpidemiologicalTable />}
        />
      </Route>

      {/* =================================================
          REPORTS
      ================================================= */}

      <Route
        path="/report"
        element={
          <PrivateRoute>
            <ReportLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/report/clinical" replace />}
        />

        <Route
          path="clinical"
          element={<ClinicalReport />}
        />

        <Route
          path="demographics"
          element={<DemographicsReport />}
        />

        <Route
          path="lab"
          element={<LabReport />}
        />
      </Route>

      {/* =================================================
          FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}    