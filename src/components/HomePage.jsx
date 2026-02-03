import React from 'react';

const HomePage = () => {
  const phoneNumber = "0906635679";

  const handleCall = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Halkan hadhow waxaad ku dari kartaa Supabase si loo keydiyo Location-ka dhabta ah
        window.location.href = `tel:${phoneNumber}`;
      }, () => {
        window.location.href = `tel:${phoneNumber}`;
      });
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1a1a1a' }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#ffc107', padding: '40px 20px', textAlign: 'center', borderRadius: '0 0 40px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '35px', fontWeight: '900', margin: 0, color: '#000' }}>DALMAR</h1>
        <p style={{ fontSize: '16px', marginTop: '10px', opacity: 0.8 }}>Raaxo iyo Amni kasta oo aad u baahato</p>
      </div>

      <div style={{ padding: '30px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚕</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Ma u baahantahay Bajaaj?</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Guji batoonka hoose si aad u hesho darawalka kuugu dhow Garoowe.</p>

        <button 
          onClick={handleCall}
          style={{
            width: '100%',
            maxWidth: '300px',
            backgroundColor: '#000',
            color: '#ffc107',
            border: 'none',
            padding: '20px',
            borderRadius: '50px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            margin: '0 auto'
          }}
        >
          <span>📞 Wac Hadda</span>
        </button>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', color: '#888' }}>
          <div>🛡️ Safar Amaan ah</div>
          <div>⚡ Jawaab Degdeg ah</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
