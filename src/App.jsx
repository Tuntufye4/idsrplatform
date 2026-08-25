// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./auth/AuthContext";

// Authentication
import Login from "./pages/login";
import Register from "./pages/register";

// Main pages     
import SelectPage from "./pages/select";
import Dashboard from "./pages/dashboard";
import MapView from "./pages/map";       

// Table pages
import DemographicsTable from "./pages/tables/demographics";
import ClinicalTable from "./pages/tables/clinical_details";
import LabTable from "./pages/tables/lab";
import FacilityTable from "./pages/tables/facility";
import TreatmentTable from "./pages/tables/treatment";
import SurveillanceTable from "./pages/tables/surveillance_info";
import EpidemiologyTable from "./pages/tables/epidemiological";

// Report pages
import ClinicalReport from "./pages/reports/clinical";
import DemographicsReport from "./pages/reports/demographics";
import LabReport from "./pages/reports/lab";

/* =====================================================
   PROTECTED ROUTE
===================================================== */

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading IDSR...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* =====================================================
   APP
===================================================== */

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= AUTH ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================= SELECT ================= */}

      <Route
        path="/select"
        element={
          <ProtectedRoute>
            <SelectPage />
          </ProtectedRoute>
        }
      />

      {/* ================= DASHBOARD ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Keep "/" pointing to dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= MAP ================= */}

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapView />
          </ProtectedRoute>
        }
      />

      {/* ================= TABLES ================= */}

      <Route
        path="/tables"
        element={
          <ProtectedRoute>    
            <SelectPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/demographics"
        element={
          <ProtectedRoute>
            <DemographicsTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/clinical_details"
        element={
          <ProtectedRoute>
            <ClinicalTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/lab"
        element={
          <ProtectedRoute>
            <LabTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/facility"
        element={
          <ProtectedRoute>
            <FacilityTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/treatment"
        element={
          <ProtectedRoute>
            <TreatmentTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/surveillance_info"
        element={
          <ProtectedRoute>
            <SurveillanceTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table/epidemiological"
        element={
          <ProtectedRoute>
            <EpidemiologyTable />
          </ProtectedRoute>
        }
      />

      {/* ================= REPORTS ================= */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ClinicalReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report/clinical"
        element={
          <ProtectedRoute>
            <ClinicalReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report/demographics"
        element={
          <ProtectedRoute>
            <DemographicsReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report/lab"
        element={
          <ProtectedRoute>
            <LabReport />
          </ProtectedRoute>
        }
      />

      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

/* =====================================================
   ROOT APP
===================================================== */

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;