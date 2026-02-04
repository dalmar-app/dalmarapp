import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Faylasha ku jira folder-ka components
import HomePage from './components/HomePage';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel'; // KU CUSUB: Soo dhoweynta Admin-ka

// 2. Faylka yaalla bannaanka (isla src dhexdiisa)
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Bogga Macmiilka (Ka dalbashada Bajaajta) */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Bogga Login-ka Darawalka (PIN-ka laga galo) */}
        <Route path="/driver-login" element={<Login />} />

        {/* 3. Bogga Dashboard-ka Darawalka (Meel u gaar ah darawalka) */}
        <Route path="/drivers" element={<DriverDashboard />} />

        {/* 4. Bogga Admin-ka (Adiga: Magacaaga Ahmed & PIN 2003) */}
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* Dib u celin haddii link-ga la qaldo */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
