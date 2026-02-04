import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Faylasha ku jira folder-ka components
import HomePage from './components/HomePage';
import Login from './components/Login';

// 2. Faylasha yaalla bannaanka (isla src dhexdiisa)
import DriverDashboard from './DriverDashboard'; 
import AdminPanel from './AdminPanel'; // SAX: Halkan ayaan ka saarnay /components/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver-login" element={<Login />} />
        <Route path="/drivers" element={<DriverDashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        
        {/* Dib u celin haddii link-ga la qaldo */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
