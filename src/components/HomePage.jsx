import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [detectedCity, setDetectedCity] = useState(""); // Magaalada halkan ayay ku kaydmaysaa

  // Marka uu qofku bogga furo, isku day inaad ogaatid magaaladiisa
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
        const data = await res.json();
        setDetectedCity(data.city || data.locality || "");
      } catch (err) {
        console.log("Magaalada lama aqoonsan");
      }
    });
  }, []);

  const requestBajaaj = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await res.json();
        const cityName = data.city || data.locality || "Garowe";

        const { error } = await supabase.from('bookings').insert([{ 
          phone: 'Macaamiil Cusub', 
          location: `${lat},${lon}`, 
          city: cityName, 
          status: 'pending' 
        }]);

        if (!error) setSent(true);
      } catch (err) { alert("Cilad internet!"); }
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
        <h1 style={{color: 'white', margin: '10px 0'}}>DALMAR</h1>
        <p style={{color: '#38bdf8', fontWeight: 'bold'}}>Smart Transport System</p>
        
        {!sent ? (
          <div style={{marginTop: '20px'}}>
            <button onClick={requestBajaaj} disabled={loading} style={styles.btn}>
              {loading ? 'Raadinaya...' : `DALBO BAJAAJ ${detectedCity.toUpperCase()}`}
            </button>
            {detectedCity && <p style={{color: '#94a3b8', fontSize: '12px', marginTop: '10px'}}>Waxaan ku aqoonsannay inaad joogto: {detectedCity}</p>}
          </div>
        ) : (
          <div style={{marginTop: '20px'}}>
            <h2 style={{color: '#34d399'}}>✅ Dalabkaagu waa dirmay!</h2>
            <p style={{color: '#94a3b8'}}>Darawal jooga {detectedCity} ayaa laguu soo diray.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'radial-gradient(circle, #1e293b, #0f172a)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '40px', borderRadius: '35px', textAlign: 'center', width: '320px', border: '1px solid #334155', backdropFilter: 'blur(10px)' },
  btn: { width: '100%', padding: '18px', background: 'linear-gradient(45deg, #0284c7, #7c3aed)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }
};

export default HomePage;
