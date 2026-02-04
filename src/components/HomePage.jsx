import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Hubi in URL-ka iyo Key-gaagu ay sax yihiin
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

    // 1. QABASHADA GPS-KA (AUTOMATIC)
    if (!navigator.geolocation) {
      alert("Browser-kaagu ma taageero GPS-ka. Fadlan isticmaal Chrome ama Safari.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 2. U DIRISTA DATABASE-KA
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
          alert("Cilad ayaa dhacday: " + error.message);
        } else {
          alert("Dalabkaaga waa la gudbiyey! Darawal ayaa isla markaba kugu soo wacaya.");
          setPhoneNumber('');
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        alert("Fadlan ogolaaw GPS-ka (Location) si darawalku kuu helo!");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🚖 DALMAR BAJAAJ</h1>
      </header>

      <div style={styles.card}>
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
          {loading ? 'DURBA WAA LA DIRAYAA...' : 'DALBO BAJAAJ'}
        </button>
      </div>

      <footer style={styles.footer}>
        <p>© 2026 Dalmar App - Garowe, Somalia</p>
      </footer>
    </div>
  );
};

const styles = {
  container: { 
    padding: '40px 20px', 
    backgroundColor: '#0f172a', 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    fontFamily: 'sans-serif'
  },
  header: { marginBottom: '40px' },
  logo: { color: '#38bdf8', fontSize: '32px', fontWeight: 'bold' },
  card: { 
    backgroundColor: '#1e293b', 
    padding: '30px', 
    borderRadius: '25px', 
    width: '100%', 
    maxWidth: '400px', 
    border: '1px solid #334155',
    textAlign: 'center'
  },
  label: { color: '#94a3b8', marginBottom: '20px', fontSize: '16px' },
  input: { 
    width: '100%', 
    padding: '15px', 
    borderRadius: '12px', 
    border: '2px solid #334155', 
    backgroundColor: '#0f172a', 
    color: 'white', 
    fontSize: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    outline: 'none'
  },
  btn: { 
    width: '100%', 
    padding: '16px', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    fontSize: '18px', 
    cursor: 'pointer', 
    color: '#0f172a',
    transition: '0.3s'
  },
  footer: { marginTop: 'auto', color: '#475569', fontSize: '12px' }
};

export default HomePage;
