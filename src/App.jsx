import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverDashboard from './DriverDashboard';
import AdminPanel from './AdminPanel'; // HUBI INAAD HALKAN KA SOO "IMPORT" GARAYSO

function App() {
  return (
    <Router>
      <Routes>
        {/* Bogga darawalka */}
        <Route path="/drivers" element={<DriverDashboard />} />
        
        {/* Bogga Admin-ka (Kani waa kan kuu keena warqadda cad haddii uusan sax ahayn) */}
        <Route path="/admin-secret-page" element={<AdminPanel />} />
        
        {/* Bogga hore ee App-ka (Optional) */}
        <Route path="/" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
