import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminPanel from './pages/SuperAdminPanel';
import ResellerPanel from './pages/ResellerPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/reseller" replace />} />
        <Route path="/admin/*" element={<SuperAdminPanel />} />
        <Route path="/reseller/*" element={<ResellerPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;