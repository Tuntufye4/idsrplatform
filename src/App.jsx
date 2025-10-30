import React from 'react';        
import { Routes, Route } from 'react-router-dom';   
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/Map';
import FormPage from './pages/Form';
import TablePage from './pages/Table';
import ReportPage from './pages/Report';
  
const App = () => (   
  
    <div className="flex">
      <Sidebar />  
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </div>
  
);

export default App;
