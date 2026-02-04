import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [detectedCity, setDetectedCity] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
        const data = await res.json();
        setDetectedCity(data.city || data.locality || "");
      } catch (err) { console.log("Magaalada lama aqoonsan"); }
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
        
        {!sent ? (
          <div style={{marginTop: '20px'}}>
            <button onClick={requestBajaaj} disabled={loading} style={styles.btn}>
              {loading ? 'Raadinaya...' : `DALBO BAJAAJ ${detectedCity.toUpperCase()}`}
            </button>
          </div>
        ) : (
          <div style={{marginTop: '20px'}}>
            <h2 style={{color: '#34d399'}}>✅ Dalabkaagu waa dirmay!</h2>
          </div>
        )}

        {/* --- QAYBTA XIRIIRKA (CUSUB) --- */}
        <div style={styles.contactSection}>
          <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '15px'}}>Ma u baahan tahay caawimaad?</p>
          
          <div style={styles.contactGrid}>
            <a href="https://wa.me/252906635679" target="_blank" style={{...styles.contactBtn, backgroundColor: '#25D366'}}>
              💬 WhatsApp
            </a>
            <a href="tel:0906635679" style={{...styles.contactBtn, backgroundColor: '#0284c7'}}>
              📞 Golis Call
            </a>
            <a href="tel:666635679" style={{...styles.contactBtn, backgroundColor: '#7c3aed'}}>
              📞 Somtel Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'radial-gradient(circle, #1e293b, #0f172a)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '30px', borderRadius: '35px', textAlign: 'center', width: '100%', maxWidth: '350px', border: '1px solid #334155' },
  btn: { width: '100%', padding: '18px', background: 'linear-gradient(45deg, #0284c7, #7c3aed)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  contactSection: { marginTop: '30px', borderTop: '1px solid #334155', paddingTop: '20px' },
  contactGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  contactBtn: { padding: '12px', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', display: 'block' }
};

export default HomePage;
