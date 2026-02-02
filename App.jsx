import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './components/OperatorView';
import DriverDashboard from './components/DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga hore ee Operator-ka */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Bogga darawalka ee aad hadda dhistay */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
