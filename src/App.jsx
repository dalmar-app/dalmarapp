import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Maadaama faylkaagu uu folder-ka dhexdiisa ku jiro:
import HomePage from './components/HomePage';
import Login from './components/Login';
import DriverDashboard from './components/DriverDashboard'; // KU DAR HADDII UU KA MAQAN YAHAY

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver-login" element={<Login />} />
        <Route path="/drivers" element={<DriverDashboard />} />
        
        {/* Haddii qofku link qaldan qoro */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
