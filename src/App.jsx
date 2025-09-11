import React from 'react';        
import { Routes, Route } from 'react-router-dom';   
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MapView from './components/Map';
import FormPage from './components/Form';
import TablePage from './components/Table';
import ReportPage from './components/Report';
  
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
