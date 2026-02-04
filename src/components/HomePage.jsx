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
    // Isku day inaad ogaato magaalada marka bogga la furo
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
        const data = await res.json();
        
        // Waxaan halkan ka saarnay "District" iyo wixii la mid ah
        // Kaliya magaca magaalada safiga ah ayaan qaadanaynaa
        const rawCity = data.city || data.locality || "";
        const cleanCity = rawCity.replace(/District|Region|State|Municipality/gi, "").trim();
        setDetectedCity(cleanCity);
      } catch (err) { console.log("Magaalada lama ogaan"); }
    });
  }, []);

  const requestBajaaj = async () => {
    setLoading(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await res.json();
        
        // Mar kale halkan ka nadiifi magaca magaalada
        const rawCity = data.city || data.locality || "Garowe";
        const cleanCity = rawCity.replace(/District|Region|State|Municipality/gi, "").trim();

        const { error } = await supabase.from('bookings').insert([{ 
          phone: 'Macaamiil Cusub', 
          location: `${lat},${lon}`, 
          city: cleanCity, 
          status: 'pending' 
        }]);
        if (!error) setSent(true);
      } catch (err) { alert("Cilad internet!"); }
      setLoading(false);
    }, () => {
      alert("Fadlan daar Location-ka");
      setLoading(false);
    }, options);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DALMAR App',
          text: 'Walaal kaalay dalbo bajaaj adoo gurigaaga jooga, adeeg degdeg ah!',
          url: 'https://dalmarapp.vercel.app/',
        });
      } catch (err) { console.log('Share error'); }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* LOGO */}
        <div style={styles.logoContainer}>
           <div style={styles.iconCircle}>
              <span style={{fontSize: '40px'}}>🛺</span>
           </div>
           <h1 style={styles.brandName}>DALMAR</h1>
           <p style={styles.tagline}>Aamin iyo Degdeg</p>
        </div>
        
        {!sent ? (
          <div style={{marginTop: '10px'}}>
            <button onClick={requestBajaaj} disabled={loading} style={styles.btn}>
              {loading ? 'Raadinaya...' : `DALBO BAJAAJ ${detectedCity.toUpperCase()}`}
            </button>
            <button onClick={handleShare} style={styles.shareBtn}>
               📤 LA WADAAG SAAXIIB
            </button>
          </div>
        ) : (
          <div style={{marginTop: '20px'}}>
            <h2 style={{color: '#34d399'}}>✅ Dalabkaagu waa dirmay!</h2>
            <p style={{color: '#94a3b8', fontSize: '14px'}}>Darawal ayaa laguu soo diray.</p>
          </div>
        )}

        {/* CONTACT */}
        <div style={styles.contactSection}>
          <p style={{color: '#94a3b8', fontSize: '13px', marginBottom: '15px'}}>Ma u baahan tahay caawimaad?</p>
          <div style={styles.contactGrid}>
            <a href="https://wa.me/252906635679" target="_blank" style={{...styles.contactBtn, backgroundColor: '#25D366'}}>
              💬 WhatsApp
            </a>
            <a href="tel:0906635679" style={{...styles.contactBtn, backgroundColor: '#0284c7'}}>
              📞 Golis: 0906635679
            </a>
            <a href="tel:666635679" style={{...styles.contactBtn, backgroundColor: '#7c3aed'}}>
              📞 Somtel: 666635679
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'radial-gradient(circle, #1e293b, #0f172a)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.9)', padding: '30px', borderRadius: '35px', textAlign: 'center', width: '100%', maxWidth: '350px', border: '1px solid #334155', backdropFilter: 'blur(10px)' },
  logoContainer: { marginBottom: '25px' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px', border: '2px solid #38bdf8', boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)' },
  brandName: { color: 'white', fontSize: '28px', letterSpacing: '2px', fontWeight: 'bold', margin: '0' },
  tagline: { color: '#38bdf8', fontSize: '11px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold' },
  btn: { width: '100%', padding: '18px', background: 'linear-gradient(45deg, #0284c7, #7c3aed)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' },
  shareBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#38bdf8', border: '2px dashed #38bdf8', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px', fontSize: '14px' },
  contactSection: { marginTop: '25px', borderTop: '1px solid #334155', paddingTop: '20px' },
  contactGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  contactBtn: { padding: '12px', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'block' }
};

export default HomePage;
