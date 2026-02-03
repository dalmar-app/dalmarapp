import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Hubi inuu magacu yahay Home (H weyn)
import DriverDashboard from './DriverDashboard';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga cusub ee qurxoon ee Home-ka */}
        <Route path="/" element={<Home />} />
        
        {/* Bogga Darawalka */}
        <Route path="/drivers" element={<DriverDashboard />} />
        
        {/* Bogga Admin-ka */}
        <Route path="/admin-secret-page" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
