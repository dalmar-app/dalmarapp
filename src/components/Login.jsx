import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Waxaad halkan dhigi kartaa Pin-ka aad rabto (tusaale: 2026)
    if (pin === '2026') {
      onLogin(true);
    } else {
      setError('Pin-ka aad gelisay waa khalad!');
      setPin('');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid #334155' }}>
        <div style={{ fontSize: '60px', marginBottom: '10px' }}>🛺</div>
        <h2 style={{ color: '#38bdf8', marginBottom: '5px' }}>Dalmar Driver</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>Geli Pin-kaaga si aad u bilawdo shaqada</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="****" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '24px', textAlign: 'center', letterSpacing: '10px', marginBottom: '15px', outline: 'none' }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '15px' }}>{error}</p>}
          
          <button style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            GAL DASHBOARD-KA
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
