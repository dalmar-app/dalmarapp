import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Soo dhoweynta bogagga (Imports)
import HomePage from './components/HomePage';
import Login from './components/Login';
// Halkan u fiiro dheh: "./" macnaheedu waa isla folder-ka src dhexdiisa
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Bogga Macmiilka */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Bogga Login-ka */}
        <Route path="/driver-login" element={<Login />} />

        {/* 3. Bogga Dashboard-ka (Kan yaalla src) */}
        <Route path="/drivers" element={<DriverDashboard />} />

        {/* 4. Dib u celin haddii link-ga la qaldo */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
