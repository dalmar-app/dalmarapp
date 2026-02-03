import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './OperatorView';
import DriverDashboard from './DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OperatorView />} />
        <Route path="/drivers" element={<DriverDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
