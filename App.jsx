import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './OperatorView';
import DriverDashboard from './DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga hore */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Bogga darawalka */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
