import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
// FORMS
// =====================================================


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

function App() {
  return (
    <Routes>

      {/* =================================================
          AUTH
      ================================================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* =================================================
          MAIN
      ================================================= */}

      <Route path="/" element={<Select />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/map" element={<MapView />} />


      {/* =================================================
          REPORT CASE
      ================================================= */}

      
  


      {/* =================================================
          TABLES
          Folder: pages/table/
      ================================================= */}

      <Route
        path="/table"
        element={<TableSidebar />}
      />

      <Route
        path="/table/demographics"
        element={<DemographicsTable />}
      />

      <Route
        path="/table/clinical_details"
        element={<ClinicalTable />}
      />

      <Route
        path="/table/lab"
        element={<LabTable />}
      />

      <Route
        path="/table/facility"
        element={<FacilityTable />}
      />

      <Route
        path="/table/treatment"
        element={<TreatmentTable />}
      />

      <Route
        path="/table/surveillance_info"
        element={<SurveillanceTable />}
      />

      <Route
        path="/table/epidemiological"
        element={<EpidemiologicalTable />}
      />


      {/* =================================================
          REPORTS
          Folder: pages/report/
      ================================================= */}

      <Route
        path="/report"
        element={<ReportSidebar />}
      />

      <Route
        path="/report/clinical"
        element={<ClinicalReport />}
      />

      <Route
        path="/report/demographics"
        element={<DemographicsReport />}
      />

      <Route
        path="/report/lab"
        element={<LabReport />}
      />


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

export default App;