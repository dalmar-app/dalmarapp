import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './components/HomePage'; 
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga hore ee laga dalbanayo */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Bogga madow ee darawalka */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
