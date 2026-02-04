import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Soo dhoweynta bogagga (Imports)
import HomePage from './components/HomePage';
import Login from './components/Login';
import DriverDashboard from './components/DriverDashboard'; // Hubi inuu folder-ka components ku dhex jiro

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Bogga Hore (Macmiilka) */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Bogga Login-ka Darawalka */}
        <Route path="/driver-login" element={<Login />} />

        {/* 3. Bogga Dashboard-ka Darawalka (Ammaan ah) */}
        <Route path="/drivers" element={<DriverDashboard />} />

        {/* 4. Haddii qofku qoro Link aan jirin, dib ugu celi HomePage */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
