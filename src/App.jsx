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
import EpidemicsForm from './pages/form/epidemiological';  
import DemographicsForm from './pages/form/demographics';  
import ClinicalTablePage from './pages/table/clinical_details';   
import FacilityTablePage from './pages/table/facility';  
import DemographicsTablePage from './pages/table/demographics';
import LabTablePage from './pages/table/lab';   
import Surveillance_infoTablePage from './pages/table/surveillance_info';
import TreatmentTablePage from './pages/table/treatment';           
import DemographicsReportPage from './pages/report/demographics';
import ClinicalReportPage from './pages/report/clinical';
import EpidemicsTablePage from './pages/table/epidemiological';
import LabReportPage from './pages/report/lab';


  
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
          <Route path="/form/epidemiological" element={<EpidemicsForm/>} />
          <Route path="/form/demographics" element={<DemographicsForm/>} />
          <Route path="/table/clinical_details" element={<ClinicalTablePage />} />
          <Route path="/table/facility" element={<FacilityTablePage />} />  
          <Route path="/table/lab" element={<LabTablePage />} />   
          <Route path="/table/surveillance_info" element={<Surveillance_infoTablePage />} />   
          <Route path="/table/treatment" element={<TreatmentTablePage />} />
          <Route path="/table/demographics" element={<DemographicsTablePage />}  />
          <Route path="/table/epidemiological" element={<EpidemicsTablePage/>} />  
          <Route path="/report/demographics" element={<DemographicsReportPage />} />
          <Route path="/report/clinical" element={<ClinicalReportPage />} />   
          <Route path="/report/lab" element={<LabReportPage />} />       
        </Routes>
      </div>
    </div>     
     
);

export default App;
