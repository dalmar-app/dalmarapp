import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Soo jiidashada Boggaga (Imports)
// HUBI: HomePage wuxuu ku dhex jiraa galka 'components'
import HomePage from './components/HomePage'; 
import DriverDashboard from './DriverDashboard';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* BOGGA HORE (Home): 
            Kani waa kan automatic-ga u garanaya magaalada (Garowe, Muqdisho, etc.)
          */}
          <Route path="/" element={<HomePage />} />

          {/* BOGGA DARAWALKA (Driver): 
            Halkan ayuu darawalku ka dooranayaa magaalada uu joogo
          */}
          <Route path="/drivers" element={<DriverDashboard />} />

          {/* BOGGA MAAMULKA (Admin): 
            Halkan ayaad kaga kormeeraysaa dhamaan magaalooyinka
          */}
          <Route path="/admin-secret-page" element={<AdminPanel />} />
          
          {/* Haddii qofku link khaldan galo, ku celi Home-ka */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
