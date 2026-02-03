import React from 'react';

const DriverDashboard = () => {
  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4CAF50' }}>Dalmar - Driver Dashboard</h1>
      <p>Kani waa bogga darawalka. Halkan ayaad ka arki doontaa dalabaadka cusub.</p>
      
      <div style={{ 
        border: '1px solid #333', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px',
        backgroundColor: '#262626'
      }}>
        <h3>Dalabaadka Hadda Taagan</h3>
        <p style={{ color: '#888' }}>Ma jiraan dalabaad cusub hadda...</p>
      </div>
    </div>
  );
};

export default DriverDashboard;
