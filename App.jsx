import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './OperatorView';
import DriverDashboard from './DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Kan waa bogga macmiilku wax ka dalbanayo */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Kan waa bogga darawalku ka arkayo dalabka */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
