import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const requestBajaaj = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        // GPS u beddel magac magaalo
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await res.json();
        const cityName = data.city || data.locality || "Garowe";

        const { error } = await supabase.from('bookings').insert([{ 
          phone: 'Macaamiil Cusub', 
          location: `${lat},${lon}`, 
          city: cityName, 
          trip_type: 'Bajaaj',
          status: 'pending' 
        }]);

        if (!error) setSent(true);
      } catch (err) { alert("Cilad internet ayaa dhacday."); }
      setLoading(false);
    }, () => {
      alert("Fadlan daar Location-ka");
      setLoading(false);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={{fontSize: '50px'}}>🛺</span>
        <h1 style={{color: 'white'}}>DALMAR</h1>
        <p style={{color: '#38bdf8'}}>Smart Transport System</p>
        {!sent ? (
          <button onClick={requestBajaaj} disabled={loading} style={styles.btn}>
            {loading ? 'Raadinaya...' : 'DALBO BAJAAJ'}
          </button>
        ) : (
          <h2 style={{color: '#34d399'}}>✅ Dalabkaagu waa dirmay!</h2>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '300px' },
  btn: { width: '100%', padding: '15px', background: 'linear-gradient(45deg, #38bdf8, #6366f1)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }
};

export default HomePage;
