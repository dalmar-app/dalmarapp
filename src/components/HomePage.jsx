import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const HomePage = () => {
  const [phone, setPhone] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // PWA State
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Soo qaado sawirka
    const fetchProfile = async () => {
      let { data } = await supabase.from('profiles').select('image_url').eq('owner_name', 'Eng Ahmed').single();
      if (data?.image_url) setProfileImage(data.image_url);
    };
    fetchProfile();

    // 2. PWA Logic: Maqlay qofka raba inuu install-gareeyo
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App-ka waa la shubtay!');
      }
      setDeferredPrompt(null);
    } else {
      alert("Browser-kaagu ma taageerayo Install-ka hadda ama mar hore ayaad shubatay!");
    }
  };

  const handleBooking = async () => {
    if (phone.length < 7) return alert("Fadlan nambar sax ah geli!");
    setIsOrdered(true);
    await supabase.from('bookings').insert([{ phone, city: 'Garowe', status: 'pending' }]);
  };

  // ... (handleImageUpload iyo handleNameClick sidiisii hore u daa)

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        {/* ... Profile Image UI ... */}
        <h1 onClick={() => {
            const newCount = clickCount + 1;
            setClickCount(newCount);
            if (newCount === 3) setIsAdmin(true);
            if (newCount === 5) navigate('/driver-login');
        }} style={styles.name}>Eng Ahmed Abdirisak Ali</h1>
      </div>

      <div style={styles.appZone}>
        {!isOrdered ? (
          <div style={styles.card}>
            <h2 style={{color: '#38bdf8', marginBottom: '15px'}}>Dalbo Bajaaj Hadda</h2>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              style={styles.input} 
              placeholder="Geli nambarkaaga..." 
            />
            <button onClick={handleBooking} style={styles.btn}>GUD BI DALABKA</button>
            
            {/* BADHANKA INSTALL-KA OO CUSUB */}
            <button onClick={handleInstallApp} style={styles.installBtn}>
              📥 INSTALL APP-KA
            </button>
          </div>
        ) : (
          <div style={styles.successCard}>
            <h3>MAHADSANID! ✅</h3>
            <p>Dalabka waa la diray.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // ... Styles-kaagii hore ...
  container: { padding: '40px 20px', backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' },
  heroSection: { textAlign: 'center', marginBottom: '30px' },
  name: { fontSize: '26px', fontWeight: 'bold', cursor: 'pointer' },
  appZone: { width: '100%', maxWidth: '350px' },
  card: { backgroundColor: '#1e293b', padding: '25px', borderRadius: '20px', textAlign: 'center' },
  input: { padding: '12px', width: '100%', borderRadius: '10px', marginBottom: '15px', backgroundColor: '#0f172a', color: 'white' },
  btn: { padding: '14px', width: '100%', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  installBtn: { 
    padding: '10px', 
    width: '100%', 
    backgroundColor: 'transparent', 
    border: '1px solid #38bdf8', 
    color: '#38bdf8', 
    borderRadius: '10px', 
    marginTop: '10px', 
    cursor: 'pointer',
    fontSize: '12px'
  },
  successCard: { backgroundColor: '#16a34a', padding: '25px', borderRadius: '20px', textAlign: 'center' }
};

export default HomePage;
