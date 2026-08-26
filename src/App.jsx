import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
// Folder: pages/table/
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
// Folder: pages/report/
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
// Prevent logged-in users from accessing login/register
// =====================================================
function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
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
          HOME / SELECT
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
          TABLE SIDEBAR
      ================================================= */}

      <Route
        path="/table"
        element={
          <PrivateRoute>
            <TableSidebar />
          </PrivateRoute>
        }
      />

      {/* =================================================
          TABLES
      ================================================= */}

      <Route
        path="/table/demographics"
        element={
          <PrivateRoute>
            <DemographicsTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/table/clinical_details"
        element={
          <PrivateRoute>
            <ClinicalTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/table/lab"
        element={
          <PrivateRoute>
            <LabTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/table/facility"
        element={
          <PrivateRoute>
            <FacilityTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/table/treatment"
        element={
          <PrivateRoute>
            <TreatmentTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/table/surveillance_info"
        element={
          <PrivateRoute>
            <SurveillanceTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/table/epidemiological"
        element={
          <PrivateRoute>
            <EpidemiologicalTable />
          </PrivateRoute>
        }
      />

      {/* =================================================
          REPORT SIDEBAR
      ================================================= */}

      <Route
        path="/report"
        element={
          <PrivateRoute>
            <ReportSidebar />
          </PrivateRoute>
        }
      />

      {/* =================================================
          REPORTS
      ================================================= */}

      <Route
        path="/report/clinical"
        element={
          <PrivateRoute>
            <ClinicalReport />
          </PrivateRoute>
        }
      />

      <Route
        path="/report/demographics"
        element={
          <PrivateRoute>
            <DemographicsReport />
          </PrivateRoute>
        }
      />

      <Route
        path="/report/lab"
        element={
          <PrivateRoute>
            <LabReport />
          </PrivateRoute>
        }
      />

      {/* =================================================
          FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}