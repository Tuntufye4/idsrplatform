import React from 'react';           
import { Routes, Route } from 'react-router-dom';   
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/Map';   
import FormPage from './pages/Form';
import ClinicalTablePage from './pages/table/clinical_details';
import FacilityTablePage from './pages/table/facility';  
import LabTablePage from './pages/table/lab';
import Surveillance_infoTablePage from './pages/table/surveillance_info';
import TreatmentTablePage from './pages/table/treatment';     
import ReportPage from './pages/Report';
  
const App = () => (      
  
    <div className="flex">
      <Sidebar />  
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/table/clinical_details" element={<ClinicalTablePage />} />
          <Route path="/table/facility" element={<FacilityTablePage />} />
          <Route path="/table/lab" element={<LabTablePage />} />
          <Route path="/table/surveillance_info" element={<Surveillance_infoTablePage />} />
          <Route path="/table/treatment" element={<TreatmentTablePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </div>
  
);

export default App;
