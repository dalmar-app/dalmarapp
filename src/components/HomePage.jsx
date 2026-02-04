import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const HomePage = () => {
  const [phone, setPhone] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const handleBooking = async () => {
    if (phone.length < 7) return alert("Fadlan nambar sax ah geli!");
    
    // GPS qabasho
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await supabase.from('bookings').insert([{ 
        phone, city: 'Garowe', status: 'pending', lat: pos.coords.latitude, lng: pos.coords.longitude 
      }]);
      setIsOrdered(true);
    }, async () => {
      // Haddii GPS la diido nambarka uun baa baxaya
      await supabase.from('bookings').insert([{ phone, city: 'Garowe', status: 'pending' }]);
      setIsOrdered(true);
    });
  };

  return (
    <div style={styles.container}>
      {/* CSS Animation loogu talagalay Bajaajta socota */}
      <style>
        {`
          @keyframes moveBajaaj {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          .road {
            width: 100%;
            height: 40px;
            position: relative;
            overflow: hidden;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
          }
          .bajaaj-icon {
            font-size: 35px;
            position: absolute;
            animation: moveBajaaj 12s infinite linear; /* 12s waa slow (tartiib) */
          }
          .line {
            width: 100%;
            height: 2px;
            background: #334155;
            position: absolute;
            bottom: 5px;
          }
        `}
      </style>

      <h1 style={{color: '#38bdf8', marginBottom: '10px'}}>DALMAR 🛺</h1>

      {/* Qaybta Bajaajta socota */}
      <div className="road">
        <div className="bajaaj-icon">🛺</div>
        <div className="line"></div>
      </div>

      {!isOrdered ? (
        <div style={styles.card}>
          <p style={{marginBottom: '15px', color: '#94a3b8'}}>Gali nambarkaaga si lagugu soo waco</p>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            style={styles.input} 
            placeholder="090..." 
          />
          <button onClick={handleBooking} style={styles.btn}>DALBO BAJAAJ</button>
        </div>
      ) : (
        <div style={styles.successCard}>
          <h3>MAHADSANID! ✅</h3>
          <p>Dalabkaaga waa la helay. Darawal ayaa kugu soo wacaya hadda.</p>
        </div>
      )}

      <footer style={styles.footer}>
        © 2026 Eng Ahmed Abdirisak Ali <br/>
        <span style={{fontSize: '10px', opacity: 0.5}}>All Rights Reserved</span>
      </footer>
    </div>
  );
};

const styles = {
  container: { 
    padding: '40px 20px', 
    backgroundColor: '#0f172a', 
    minHeight: '100vh', 
    textAlign: 'center', 
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: { 
    backgroundColor: '#1e293b', 
    padding: '30px', 
    borderRadius: '20px', 
    border: '1px solid #334155',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
  },
  successCard: { 
    backgroundColor: '#22c55e', 
    padding: '30px', 
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px'
  },
  input: { 
    padding: '15px', 
    width: '100%', 
    borderRadius: '12px', 
    marginBottom: '20px', 
    fontSize: '20px',
    textAlign: 'center',
    backgroundColor: '#0f172a',
    color: 'white',
    border: '1px solid #334155'
  },
  btn: { 
    padding: '18px', 
    width: '100%', 
    backgroundColor: '#38bdf8', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#0f172a'
  },
  footer: { 
    marginTop: 'auto', 
    paddingTop: '40px',
    color: '#475569', 
    fontSize: '12px',
    lineHeight: '1.6'
  }
};

export default HomePage;
