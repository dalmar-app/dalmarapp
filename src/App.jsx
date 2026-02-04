import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Kuwani waxay ku jiraan folder-ka components (Waa sax)
import HomePage from './components/HomePage';
import Login from './components/Login';

// 2. Kani wuxuu yaallaa isla src dhexdiisa (Bannaanka)
// Waa in laga saaraa ereyga 'components'
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

