import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Faylasha ku jira components
import HomePage from './components/HomePage';
import Login from './components/Login';

// Faylka DriverDashboard wuxuu yaallaa isla src dhexdiisa (bannaanka)
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver-login" element={<Login />} />
        <Route path="/drivers" element={<DriverDashboard />} />
        
        {/* Haddii link-ga la qaldo, dib u celi */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
