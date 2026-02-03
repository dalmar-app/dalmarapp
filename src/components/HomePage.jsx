import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const requestTaxi = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const loc = `${position.coords.latitude},${position.coords.longitude}`;
      const { error } = await supabase
        .from('bookings')
        .insert([{ phone: 'Macaamiil Cusub', location: loc, status: 'pending' }]);

      if (!error) {
        setSent(true);
      }
      setLoading(false);
    }, () => {
      alert("Fadlan oggolow Location-ka");
      setLoading(false);
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '350px' }}>
        <h1 style={{ fontSize: '40px', margin: '0' }}>🚗 DALMAR</h1>
        <p style={{ color: '#38bdf8' }}>Garoowe Taxi Service</p>
        
        {!sent ? (
          <>
            <p style={{ color: '#94a3b8', margin: '20px 0' }}>Ma u baahan tahay gaari hadda?</p>
            <button 
              onClick={requestTaxi} 
              disabled={loading}
              style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: 'linear-gradient(45deg, #38bdf8, #6366f1)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Raadinaya...' : 'HADDA DALBO'}
            </button>
          </>
        ) : (
          <div>
            <h2 style={{ color: '#34d399' }}>✅ Waa la helay!</h2>
            <p>Darawalka ayaa kuu soo socda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
