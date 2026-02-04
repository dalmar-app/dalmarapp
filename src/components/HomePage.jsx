import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const sendData = async (lat = null, lng = null) => {
    const { error } = await supabase.from('bookings').insert([
      { 
        phone: phoneNumber, 
        city: 'Garowe', 
        lat: lat, 
        lng: lng, 
        status: 'pending' 
      }
    ]);

    if (error) {
      alert("Cilad: Database-ka ayaa diiday. Hubi SQL Policy!");
    } else {
      alert("Dalabkaaga waa la gudbiyey! Bajaaj ayaa kuu socota.");
      setPhoneNumber('');
    }
    setLoading(false);
  };

  const handleBooking = () => {
    if (phoneNumber.length < 7) {
      alert("Fadlan gali nambar sax ah!");
      return;
    }

    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendData(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("GPS waa la diiday, nambarka uun baa baxaya.");
          sendData(); // Dir nambarka xataa haddii GPS la waayo
        },
        { timeout: 5000 }
      );
    } else {
      sendData();
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes road { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .moving-bajaaj { position: absolute; font-size: 30px; animation: road 4s infinite linear; }
      `}</style>
      <h1 style={{color: '#38bdf8'}}>DALMAR 🛺</h1>
      <div style={{width: '100%', height: '2px', background: '#334155', position: 'relative', overflow: 'hidden', margin: '20px 0'}}>
        <div className="moving-bajaaj">🛺</div>
      </div>
      <div style={styles.card}>
        <p style={{color: '#94a3b8', marginBottom: '15px'}}>Gali nambarkaaga</p>
        <input 
          type="tel" 
          placeholder="090..." 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleBooking} style={styles.btn} disabled={loading}>
          {loading ? 'LAA DIRAYAA...' : 'DALBO BAJAAJ'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#0f172a', minHeight: '100vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '350px', border: '1px solid #334155' },
  input: { width: '100%', padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontSize: '20px', marginBottom: '20px', textAlign: 'center' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', color: '#0f172a' }
};

export default HomePage;
