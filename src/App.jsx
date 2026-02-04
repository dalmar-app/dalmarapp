import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Faylasha ku jira folder-ka components
import HomePage from './components/HomePage';
import Login from './components/Login';

// 2. Faylka yaalla bannaanka (src dhexdiisa)
// Ka fiiro dheh: "./components/" ma dhex jiro halkan
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver-login" element={<Login />} />
        <Route path="/drivers" element={<DriverDashboard />} />
        
        {/* Haddii qofku link qaldan qoro */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
