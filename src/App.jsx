import React from 'react';           
import { Routes, Route } from 'react-router-dom';   
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/Map';   
import ClinicalForm from './pages/form/clinical_details';
import FacilityForm from './pages/form/facility';
import LabForm from './pages/form/lab';
import SurveillanceForm from './pages/form/surveillance_info';
import TreatmentForm from './pages/form/treatment';   
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
          <Route path="/form/clinical_details" element={<ClinicalForm />} />
          <Route path="/form/facility" element={<FacilityForm />} />
          <Route path="/form/lab" element={<LabForm />} />
          <Route path="/form/surveillance_info" element={<SurveillanceForm />} />
          <Route path="/form/treatment" element={<TreatmentForm />} />    
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
