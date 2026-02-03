import React from 'react';

const DriverDashboard = () => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      fontFamily: 'sans-serif',
      color: '#000000', // Qoraal madow
      backgroundColor: '#ffffff', // Bog cad (si aan u aragno inuu shaqaynayo)
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red' }}>DALMAR DRIVER DASHBOARD</h1>
      <p>Haddii aad qoraalkan aragto, boggu wuu shaqaynayaa!</p>
      <div style={{ marginTop: '20px', padding: '20px', border: '2px solid black' }}>
        <h3>Dalabaadka Hadda Jira</h3>
        <p>Ma jiraan dalabaad cusub...</p>
      </div>
    </div>
  );
};

export default DriverDashboard;
