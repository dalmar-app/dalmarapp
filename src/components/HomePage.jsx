import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const HomePage = () => {
  const [phone, setPhone] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const handleSecretEntry = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 3) { navigate('/driver-login'); setClickCount(0); }
    setTimeout(() => setClickCount(0), 2000);
  };

  const handleBooking = async () => {
    if (phone.length < 7) return alert("Fadlan nambar sax ah geli!");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await supabase.from('bookings').insert([{ 
        phone, city: 'Garowe', status: 'pending', lat: pos.coords.latitude, lng: pos.coords.longitude 
      }]);
      setIsOrdered(true);
    }, async () => {
      await supabase.from('bookings').insert([{ phone, city: 'Garowe', status: 'pending' }]);
      setIsOrdered(true);
    });
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 10px #38bdf8; }
            50% { box-shadow: 0 0 25px #38bdf8; }
            100% { box-shadow: 0 0 10px #38bdf8; }
          }
          .profile-img {
            border: 4px solid #38bdf8;
            animation: glow 3s infinite;
            transition: transform 0.3s ease;
          }
          .profile-img:hover { transform: scale(1.05); }
          @keyframes moveBajaaj {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          .bajaaj-anim { animation: moveBajaaj 8s infinite linear; }
        `}
      </style>

      {/* --- PORTFOLIO HEADER --- */}
      <div style={styles.heroSection}>
        <div style={styles.imageWrapper}>
          <img 
            src="/profile.jpg" 
            alt="Eng Ahmed" 
            className="profile-img"
            style={styles.profilePic} 
          />
        </div>
        
        <h1 onClick={handleSecretEntry} style={styles.name}>Eng Ahmed Abdirisak Ali</h1>
        <p style={styles.title}>Fullstack Developer (Junior)</p>
        
        <div style={styles.bioCard}>
          <p style={styles.bioText}>
            Ku soo dhawaada Portfolio-gayga! Waxaan ahay horumariye dhisa <strong>Fullstack Applications</strong>. 
            App-ka <strong>DALMAR</strong> waa xal casri ah oo aan u dhisay dadka reer Garowe si ay ugu fududaato dalbashada bajaajta.
          </p>
        </div>
      </div>

      {showInstallBtn && (
        <button onClick={handleInstallClick} style={styles.installBtn}>
          📥 SOO DEG APP-KA DALMAR
        </button>
      )}

      {/* --- APP DEMO SECTION --- */}
      <div style={styles.appZone}>
        <div style={styles.road}>
          <div className="bajaaj-anim" style={styles.bajaajIcon}>🛺</div>
          <div style={styles.line}></div>
        </div>

        {!isOrdered ? (
          <div style={styles.card}>
            <h2 style={{fontSize: '20px', marginBottom: '15px', color: '#38bdf8'}}>Dalbo Bajaaj Hadda</h2>
            <input 
              type="tel" value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              style={styles.input} placeholder="Geli nambarkaaga..." 
            />
            <button onClick={handleBooking} style={styles.btn}>GUD BI DALABKA</button>
          </div>
        ) : (
          <div style={styles.successCard}>
            <h3 style={{fontSize: '22px', marginBottom: '10px'}}>MAHADSANID! ✅</h3>
            <p style={{fontSize: '18px', fontWeight: '500'}}>Dalabkaaga waa la gudbiyay, darawal ayaa kusoo wacaya.</p>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        <div style={{color: '#38bdf8', marginBottom: '5px'}}>📍 Garowe, Somalia</div>
        © 2026 Eng Ahmed Abdirisak Ali | Fullstack Portfolio
      </footer>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  heroSection: { textAlign: 'center', marginBottom: '40px', maxWidth: '550px' },
  imageWrapper: { marginBottom: '20px' },
  profilePic: { width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover' },
  name: { fontSize: '28px', fontWeight: '800', color: '#f8fafc', marginBottom: '5px', letterSpacing: '0.5px' },
  title: { color: '#38bdf8', fontSize: '17px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '25px', textTransform: 'uppercase' },
  bioCard: { backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  bioText: { fontSize: '16px', lineHeight: '1.6', color: '#94a3b8' },
  installBtn: { backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '14px 25px', borderRadius: '50px', fontWeight: 'bold', marginBottom: '30px', cursor: 'pointer', fontSize: '14px' },
  appZone: { width: '100%', maxWidth: '400px', textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '25px', border: '1px solid #334155', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' },
  input: { padding: '15px', width: '100%', borderRadius: '12px', marginBottom: '20px', fontSize: '20px', textAlign: 'center', backgroundColor: '#020617', color: 'white', border: '1px solid #38bdf8', boxSizing: 'border-box', outline: 'none' },
  btn: { padding: '18px', width: '100%', backgroundColor: '#38bdf8', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', color: '#020617', cursor: 'pointer', transition: '0.2s' },
  successCard: { backgroundColor: '#16a34a', padding: '35px 25px', borderRadius: '25px', color: 'white', boxShadow: '0 10px 30px rgba(22, 163, 74, 0.4)' },
  road: { width: '100%', height: '50px', position: 'relative', overflow: 'hidden', marginBottom: '15px' },
  line: { width: '100%', height: '2px', background: '#1e293b', position: 'absolute', bottom: '10px' },
  bajaajIcon: { fontSize: '35px', position: 'absolute', bottom: '12px' },
  footer: { marginTop: 'auto', paddingTop: '50px', color: '#475569', fontSize: '12px', textAlign: 'center' }
};

export default HomePage;
