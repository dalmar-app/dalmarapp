import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const Home = () => {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Garowe');

  const handleBooking = () => {
    if (phone.length < 7) { alert("Fadlan gali nambar sax ah!"); return; }

    // Soo qabashada Meesha Macmiilka (GPS)
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const { error } = await supabase.from('bookings').insert([
        { phone, city, lat: latitude, lng: longitude, status: 'pending' }
      ]);

      if (!error) {
        alert("Dalabkaaga waa la diray! Darawal ayaa kugu soo wacaaya.");
        setPhone('');
      }
    }, () => alert("Fadlan daar GPS-ka si darawalku kuu helo!"));
  };

  return (
    <div style={styles.container}>
      <h2 style={{color: 'white'}}>🚖 DALMAR BAJAAJ</h2>
      <div style={styles.card}>
        <p style={{color: '#94a3b8'}}>Gali nambarkaaga si lagugu soo waco</p>
        <input 
          type="tel" 
          placeholder="Nambarkaaga (e.g. 061...)" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleBooking} style={styles.btn}>DALBO BAJAAJ</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#0f172a', minHeight: '100vh', textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155' },
  input: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #38bdf8', marginBottom: '20px', backgroundColor: '#0f172a', color: 'white' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }
};

export default Home;
