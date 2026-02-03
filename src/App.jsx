import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Waxaan soo kaxaynaynaa bogga hore ee foomka (HomePage)
import OperatorView from './components/HomePage'; 

// Waxaan soo kaxaynaynaa bogga madow ee darawalka (DriverDashboard)
import DriverDashboard from './DriverDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Marka qofku link-ga caadiga ah furo: https://dalmarapp.vercel.app/ */}
        <Route path="/" element={<OperatorView />} />
        
        {/* Marka la furo link-ga darawalka: https://dalmarapp.vercel.app/drivers */}
        <Route path="/drivers" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
