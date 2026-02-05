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

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
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
      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          }
          .install-pulse {
            animation: pulse-green 2s infinite;
          }
          @keyframes moveBajaaj {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          .bajaaj-anim {
            animation: moveBajaaj 10s infinite linear;
          }
        `}
      </style>

      <h1 onClick={handleSecretEntry} style={styles.logo}>
        DALMAR 🛺
      </h1>

      {showInstallBtn && (
        <button onClick={handleInstallClick} className="install-pulse" style={styles.installBtn}>
          📥 SOO DEG APP-KA (INSTALL)
        </button>
      )}

      <div style={styles.road}>
        <div className="bajaaj-anim" style={styles.bajaajIcon}>🛺</div>
        <div style={styles.line}></div>
      </div>

      {!isOrdered ? (
        <div style={styles.card}>
          <p style={{marginBottom: '15px', color: '#94a3b8'}}>Gali nambarkaaga si lagugu soo waco</p>
          <input 
            type="tel" value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            style={styles.input} placeholder="090..." 
          />
          <button onClick={handleBooking} style={styles.btn}>DALBO BAJAAJ</button>
        </div>
      ) : (
        <div style={styles.successCard}>
          <h3>MAHADSANID! ✅</h3>
          <p>Dalabkaaga waa la helay. Darawal ayaa kugu soo wacaya hadda.</p>
        </div>
      )}

      <footer style={styles.footer}>© 2026 Eng Ahmed Abdirisak Ali</footer>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#0f172a', minHeight: '100vh', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  logo: { color: '#38bdf8', marginBottom: '20px', cursor: 'default', userSelect: 'none' },
  installBtn: { backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', marginBottom: '30px', cursor: 'pointer', fontSize: '14px' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '25px', border: '1px solid #334155', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
  input: { padding: '15px', width: '100%', borderRadius: '12px', marginBottom: '20px', fontSize: '20px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', boxSizing: 'border-box' },
  btn: { padding: '18px', width: '100%', backgroundColor: '#38bdf8', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', color: '#0f172a', cursor: 'pointer' },
  successCard: { backgroundColor: '#22c55e', padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '400px' },
  road: { width: '100%', height: '50px', position: 'relative', overflow: 'hidden', marginBottom: '20px' },
  line: { width: '100%', height: '2px', background: '#334155', position: 'absolute', bottom: '10px' },
  bajaajIcon: { fontSize: '35px', position: 'absolute', bottom: '12px' },
  footer: { marginTop: 'auto', paddingTop: '20px', color: '#475569', fontSize: '11px' }
};

export default HomePage;
