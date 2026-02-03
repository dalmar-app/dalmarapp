import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Soo kaxaynta boggaga
import HomePage from './components/HomePage'; 
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga dadweynaha (Customer View) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Bogga darawalka (Driver Dashboard) */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
