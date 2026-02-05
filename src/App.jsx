import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Faylasha ku jira folder-ka components
import HomePage from './components/HomePage';
import Login from './components/Login'; // Hubi in faylkani jiro

// 2. Faylasha yaalla bannaanka (src root)
import DriverDashboard from './DriverDashboard'; 
import AdminPanel from './AdminPanel'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga Macmiilka (Home) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Bogga Login-ka (Secret Portal) */}
        <Route path="/driver-login" element={<Login />} />
        
        {/* Bogga Darawalka (Driver Dashboard) */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        
        {/* Bogga Admin-ka (Admin Panel) */}
        <Route path="/admin-panel" element={<AdminPanel />} />
        
        {/* Haddii qofku link qaldan qoro, dib ugu celi Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
