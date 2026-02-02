import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperatorView from './components/OperatorView';
import DriverDashboard from './components/DriverDashboard';
import Login from './components/HomePage'; // Temporarily keeping HomePage as a clearer import if needed, but for now we follow the plan: / -> Operator, /drivers -> Driver

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OperatorView />} />
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
