import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const Home = () => {
  const [phone, setPhone] = useState('');

  const handleBooking = () => {
    if (phone.length < 7) {
      alert("Fadlan gali nambarkaaga si lagugu soo waco!");
      return;
    }

    // Qabashada GPS-ka (Location)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const { error } = await supabase.from('bookings').insert([
          { 
            phone: phone, 
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
          alert("Dalabkaaga waa la diray! Darawal ayaa kuu imaanaya.");
          setPhone('');
        }
      },
      (err) => {
        alert("Fadlan daar GPS-ka taleefankaaga si darawalku kuu helo!");
      }
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={{color: 'white'}}>🚖 DALMAR BAJAAJ</h1>
      <div style={styles.card}>
        <p style={{color: '#94a3b8', marginBottom: '15px'}}>Gali nambarkaaga si lagugu soo waco</p>
        <input 
          type="tel" 
          placeholder="090..." 
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
  container: { padding: '50px 20px', backgroundColor: '#0f172a', minHeight: '100vh', textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155' },
  input: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #38bdf8', marginBottom: '20px', backgroundColor: '#0f172a', color: 'white', fontSize: '18px' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', color: '#0f172a' }
};

export default Home;
