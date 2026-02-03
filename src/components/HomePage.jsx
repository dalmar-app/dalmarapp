import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Isku xirka Supabase
const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const requestTaxi = async () => {
    setLoading(true);
    // Qaadashada goobta uu qofku joogo (GPS)
    navigator.geolocation.getCurrentPosition(async (position) => {
      const loc = `${position.coords.latitude},${position.coords.longitude}`;
      
      const { error } = await supabase
        .from('bookings')
        .insert([{ 
          phone: 'Macaamiil Cusub', 
          location: loc, 
          trip_type: 'Bajaaj',
          status: 'pending' 
        }]);

      if (!error) {
        setSent(true);
        setLoading(false);
      } else {
        alert("Cilad ayaa dhacday, isku day mar kale.");
        setLoading(false);
      }
    }, (err) => {
      alert("Fadlan oggolow Location-ka si laguu soo helo.");
      setLoading(false);
    });
  };

  return (
    <div style={styles.container}>
      {/* Midabyada Gadaal ka iftiimaya (Orbs) */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      <div style={styles.card}>
        <div style={styles.logoContainer}>
          {/* Astaanta Bajaajta */}
          <span style={styles.logoIcon}>🛺</span>
        </div>
        
        <h1 style={styles.title}>DALMAR</h1>
        <p style={styles.subtitle}>Garoowe Bajaaj Service</p>

        {!sent ? (
          <div style={styles.actionArea}>
            <p style={styles.infoText}>Ma u baahan tahay bajaaj hadda? Hal riix uun baa kuu xiran.</p>
            <button 
              onClick={requestTaxi} 
              disabled={loading}
              style={loading ? styles.btnLoading : styles.btn}
            >
              {loading ? 'Raadinaya Goobtaada...' : 'DALBO BAJAAJ'}
            </button>
          </div>
        ) : (
          <div style={styles.successArea}>
            <div style={styles.checkIcon}>✅</div>
            <h3 style={styles.successTitle}>Waa la helay!</h3>
            <p style={styles.successText}>Bajaajta kuugu dhow ayaa kuu soo socota. Fadlan sug xoogaa.</p>
            <button onClick={() => setSent(false)} style={styles.btnSecondary}>Dalab Kale</button>
          </div>
        )}
      </div>

      <p style={styles.footerText}>© 2026 Ahmed Abdirisak | Powered by Somtel</p>
    </div>
  );
};

// Style-ka ama Qurxinta (CSS in JS)
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
    top: '-50px',
    left: '-50px',
    borderRadius: '50%',
  },
  orb2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(192,38,211,0.1) 0%, rgba(0,0,0,0) 70%)',
    bottom: '-100px',
    right: '-100px',
    borderRadius: '50%',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(12px)',
    padding: '40px 30px',
    borderRadius: '35px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  logoContainer: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
    borderRadius: '22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
  },
  logoIcon: { fontSize: '40px' },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
    margin: '0',
    letterSpacing: '2px',
    background: 'linear-gradient(to right, #fff, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: { color: '#38bdf8', fontSize: '14px', fontWeight: 'bold', marginTop: '5px', textTransform: 'uppercase' },
  actionArea: { marginTop: '30px' },
  infoText: { color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px' },
  btn: {
    width: '100%',
    padding: '18px',
    borderRadius: '18px',
    border: 'none',
    background: 'linear-gradient(45deg, #38bdf8, #6366f1)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.39)',
  },
  btnLoading: {
    width: '100%',
    padding: '18px',
    borderRadius: '18px',
    border: 'none',
    backgroundColor: '#334155',
    color: '#94a3b8',
    fontSize: '16px',
    cursor: 'not-allowed',
  },
  successArea: { padding: '20px 0' },
  checkIcon: { fontSize: '50px', marginBottom: '15px' },
  successTitle: { color: '#34d399', fontSize: '24px', margin: '0 0 10px 0' },
  successText: { color: '#94a3b8', marginBottom: '20px' },
  btnSecondary: {
    background: 'none',
    border: '1px solid #334155',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  footerText: {
    marginTop: '40px',
    color: '#475569',
    fontSize: '12px',
    zIndex: 1,
  }
};

export default HomePage;
