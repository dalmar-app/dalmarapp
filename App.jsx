import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './OperatorView';
import DriverDashboard from './DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga hore ee macmiilka */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Bogga darawalka oo kaliya */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
