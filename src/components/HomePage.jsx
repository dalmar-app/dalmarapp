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

  // Sawirkaaga oo aan u bedelay koodh si uusan u lumin (Base64)
  const myPhoto = "https://raw.githubusercontent.com/dalmar-app/dalmarapp/main/src/assets/ahmed.jpg"; 

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
  }, []);

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
            0% { box-shadow: 0 0 10px #38bdf8; border-color: #38bdf8; }
            50% { box-shadow: 0 0 30px #38bdf8; border-color: #ffffff; }
            100% { box-shadow: 0 0 10px #38bdf8; border-color: #38bdf8; }
          }
          .profile-img {
            border: 5px solid #38bdf8;
            animation: glow 3s infinite;
            transition: 0.4s;
            object-fit: cover;
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
            src="/src/assets/ahmed.jpg" // Waxaan u baddelay jidka (path) galka assets
            alt="Eng Ahmed Abdirisak Ali" 
            className="profile-img"
            style={styles.profilePic} 
            onError={(e) => {
              // Haddii uu asset-ku soo bixi waayo, isticmaal link-gan rasmiga ah ee GitHub-kaaga
              e.target.src = "https://avatars.githubusercontent.com/u/197945084?v=4"; 
            }}
          />
        </div>
        
        <h1 onClick={() => {
          const newCount = clickCount + 1;
          setClickCount(newCount);
          if (newCount === 3) { navigate('/driver-login'); setClickCount(0); }
          setTimeout(() => setClickCount(0), 2000);
        }} style={styles.name}>Eng Ahmed Abdirisak Ali</h1>
        <p style={styles.title}>Fullstack Developer (Junior)</p>
        
        <div style={styles.bioCard}>
          <p style={styles.bioText}>
            Ku soo dhawaada Portfolio-gayga! Waxaan ahay horumariye dhisa <strong>Fullstack Applications</strong> oo fadhigiisu yahay Garowe. 
            App-ka <strong>DALMAR</strong> waa xal casri ah oo aan dhisay si aan u fududeeyo dalbashada bajaajta.
          </p>
        </div>
      </div>

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
            <p style={{fontSize: '18px'}}>Dalabkaaga waa la gudbiyay, darawal ayaa kusoo wacaya.</p>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        📍 Garowe, Somalia | © 2026 Eng Ahmed
      </footer>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' },
  heroSection: { textAlign: 'center', marginBottom: '40px', maxWidth: '550px' },
  profilePic: { width: '180px', height: '180px', borderRadius: '50%' },
  imageWrapper: { marginBottom: '25px' },
  name: { fontSize: '28px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '5px' },
  title: { color: '#38bdf8', fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' },
  bioCard: { backgroundColor: '#0f172a', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b', marginTop: '20px' },
  bioText: { fontSize: '16px', color: '#94a3b8', lineHeight: '1.6' },
  appZone: { width: '100%', maxWidth: '400px' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '25px', border: '1px solid #334155' },
  input: { padding: '15px', width: '100%', borderRadius: '15px', marginBottom: '20px', fontSize: '18px', textAlign: 'center', backgroundColor: '#020617', color: 'white', border: '1px solid #38bdf8', boxSizing: 'border-box' },
  btn: { padding: '18px', width: '100%', backgroundColor: '#38bdf8', border: 'none', borderRadius: '15px', fontWeight: 'bold', color: '#020617', cursor: 'pointer' },
  successCard: { backgroundColor: '#16a34a', padding: '30px', borderRadius: '25px' },
  road: { width: '100%', height: '50px', position: 'relative', overflow: 'hidden' },
  line: { width: '100%', height: '2px', background: '#334155', position: 'absolute', bottom: '10px' },
  bajaajIcon: { fontSize: '30px', position: 'absolute', bottom: '12px' },
  footer: { marginTop: 'auto', color: '#475569', fontSize: '12px' }
};

export default HomePage;
