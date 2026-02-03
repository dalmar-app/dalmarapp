import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './components/OperatorView';
import DriverDashboard from './components/DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga Koowaad */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Bogga Darawalka */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
