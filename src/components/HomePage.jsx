import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const HomePage = () => {
  const [phone, setPhone] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  // HALKAN EEG: Waxaan isticmaalnay URL-ka sawirkaaga ee GitHub
  const profileImage = "https://avatars.githubusercontent.com/u/197945084?v=4";

  const handleBooking = async () => {
    if (phone.length < 7) return alert("Fadlan nambar sax ah geli!");
    setIsOrdered(true);
    await supabase.from('bookings').insert([{ phone, city: 'Garowe', status: 'pending' }]);
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 10px #38bdf8; border-color: #38bdf8; }
            50% { box-shadow: 0 0 25px #38bdf8; border-color: #ffffff; }
            100% { box-shadow: 0 0 10px #38bdf8; border-color: #38bdf8; }
          }
          .profile-img {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 4px solid #38bdf8;
            object-fit: cover;
            animation: glow 3s infinite;
          }
        `}
      </style>

      <div style={styles.heroSection}>
        <div style={styles.imageWrapper}>
          {/* SAWIRKAAGA OO DHAMMAYSTIRAN */}
          <img 
            src={profileImage} 
            alt="Eng Ahmed" 
            className="profile-img" 
          />
        </div>
        
        <h1 onClick={() => {
          setClickCount(prev => prev + 1);
          if (clickCount + 1 === 3) navigate('/driver-login');
        }} style={styles.name}>Eng Ahmed Abdirisak Ali</h1>
        <p style={styles.title}>Fullstack Developer (Junior)</p>
        
        <div style={styles.bioCard}>
          <p style={styles.bioText}>
            Ku soo dhawaada Portfolio-gayga! Waxaan ahay horumariye dhisa <strong>Fullstack Applications</strong>. 
            App-ka <strong>DALMAR</strong> waa xal casri ah oo aan dhisay.
          </p>
        </div>
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
          </div>
        ) : (
          <div style={styles.successCard}>
            <h3>MAHADSANID! ✅</h3>
            <p>Dalabkaaga waa la gudbiyay.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' },
  heroSection: { textAlign: 'center', marginBottom: '30px' },
  imageWrapper: { marginBottom: '20px' },
  name: { fontSize: '26px', fontWeight: 'bold', cursor: 'pointer' },
  title: { color: '#38bdf8', fontSize: '14px', letterSpacing: '1px', marginTop: '5px' },
  bioCard: { backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', marginTop: '20px', maxWidth: '400px', border: '1px solid #1e293b' },
  bioText: { color: '#94a3b8', fontSize: '15px', lineHeight: '1.5' },
  appZone: { width: '100%', maxWidth: '350px' },
  card: { backgroundColor: '#1e293b', padding: '25px', borderRadius: '20px', textAlign: 'center' },
  input: { padding: '12px', width: '100%', borderRadius: '10px', marginBottom: '15px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { padding: '14px', width: '100%', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  successCard: { backgroundColor: '#16a34a', padding: '25px', borderRadius: '20px', textAlign: 'center' }
};

export default HomePage;
