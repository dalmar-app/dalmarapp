import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = () => {
    if (phoneNumber.length < 7) {
      alert("Fadlan gali nambar sax ah!");
      return;
    }

    setLoading(true);

    if (!navigator.geolocation) {
      alert("GPS-ku ma shaqaynayo!");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const { error } = await supabase.from('bookings').insert([
          { 
            phone: phoneNumber, 
            city: 'Garowe', 
            lat: latitude, 
            lng: longitude, 
            status: 'pending',
            created_at: new Date()
          }
        ]);

        if (error) {
          alert("Cilad: " + error.message);
        } else {
          alert("Dalabkaaga waa la diray! Bajaaj ayaa kuu socota.");
          setPhoneNumber('');
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        alert("Fadlan ogolaaw GPS-ka!");
      }
    );
  };

  return (
    <div style={styles.container}>
      {/* --- ANIMATION CSS --- */}
      <style>
        {`
          @keyframes driveRoad {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(150%); }
          }
          .road {
            width: 100%;
            height: 2px;
            background: #334155;
            position: relative;
            margin: 40px 0;
            overflow: hidden;
          }
          .bajaaj-home {
            position: absolute;
            font-size: 30px;
            animation: driveRoad 5s infinite linear;
          }
        `}
      </style>

      <header style={styles.header}>
        <h1 style={styles.logo}>DALMAR 🛺</h1>
      </header>

      {/* Qaybta Bajaajta Socota */}
      <div className="road">
        <div className="bajaaj-home">🛺</div>
      </div>

      <div style={styles.card}>
        <h3 style={{color: 'white', marginBottom: '10px'}}>Soo Dhawaaw!</h3>
        <p style={styles.label}>Gali nambarkaaga si lagugu soo waco</p>
        
        <input 
          type="tel" 
          placeholder="090..." 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />
        
        <button 
          onClick={handleBooking} 
          style={{...styles.btn, backgroundColor: loading ? '#475569' : '#38bdf8'}}
          disabled={loading}
        >
          {loading ? 'LAA DIRAYAA...' : 'DALBO BAJAAJ'}
        </button>
      </div>

      <div style={{marginTop: '30px', color: '#475569', fontSize: '14px'}}>
        <p>⚡ Degdeg iyo Amaano</p>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    padding: '20px', 
    backgroundColor: '#0f172a', 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif'
  },
  header: { textAlign: 'center' },
  logo: { color: '#38bdf8', fontSize: '40px', fontWeight: 'bold', letterSpacing: '2px' },
  card: { 
    backgroundColor: '#1e293b', 
    padding: '30px', 
    borderRadius: '25px', 
    width: '100%', 
    maxWidth: '400px', 
    border: '1px solid #334155',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
  },
  label: { color: '#94a3b8', marginBottom: '20px' },
  input: { 
    width: '100%', 
    padding: '15px', 
    borderRadius: '12px', 
    border: 'none', 
    backgroundColor: '#0f172a', 
    color: 'white', 
    fontSize: '22px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  btn: { 
    width: '100%', 
    padding: '18px', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    fontSize: '18px', 
    cursor: 'pointer', 
    color: '#0f172a',
    textTransform: 'uppercase'
  }
};

export default HomePage;
