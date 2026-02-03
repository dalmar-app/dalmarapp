import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// HALKAN AYAA CILADDU JIRTAY - WAA INAAN SI SAX AH U TILMAAMNAA GALKA
import Home from './components/HomePage'; 

import DriverDashboard from './DriverDashboard';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga hore oo hadda laga soo aqrinayo galka components */}
        <Route path="/" element={<Home />} />
        
        <Route path="/drivers" element={<DriverDashboard />} />
        <Route path="/admin-secret-page" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
