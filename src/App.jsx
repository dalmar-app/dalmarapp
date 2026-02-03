import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Hubi inuu magacu sax yahay
import DriverDashboard from './DriverDashboard';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Kan ayaa ah bogga ugu horeeya ee dadku arki doonaan (/) */}
        <Route path="/" element={<Home />} />

        {/* 2. Kan waa bogga darawallada (/drivers) */}
        <Route path="/drivers" element={<DriverDashboard />} />

        {/* 3. Kan waa bogga maamulka (/admin-secret-page) */}
        <Route path="/admin-secret-page" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
