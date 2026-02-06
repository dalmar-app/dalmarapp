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
  const navigate = useNavigate();

  // 1. Soo qaado sawirka qof kasta ha arkee markuu bogga soo galo
  useEffect(() => {
    const fetchProfile = async () => {
      let { data } = await supabase.from('profiles').select('image_url').single();
      if (data) setProfileImage(data.image_url);
    };
    fetchProfile();
  }, []);

  // 2. Shaqada sawirka beddelaysa (Adiga kaliya ayaa ka soo upload-gareynaya computer-kaaga)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setProfileImage(base64Image); // Isla markiiba u tusi qofka
      
      // Ku kaydi Database-ka si dadka kale u arkaan
      await supabase.from('profiles').update({ image_url: base64Image }).eq('owner_name', 'Eng Ahmed');
      alert("Sawirka waa la xareeyay! ✅");
    };
    reader.readAsDataURL(file);
  };

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
          .profile-img-container {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 4px solid #38bdf8;
            overflow: hidden;
            animation: glow 3s infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #0f172a;
            position: relative;
            cursor: pointer;
          }
          .profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .admin-overlay {
            position: absolute;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            color: #38bdf8;
            width: 100%;
            font-size: 11px;
            padding: 4px 0;
            text-align: center;
          }
        `}
      </style>

      <div style={styles.heroSection}>
        <div style={styles.imageWrapper}>
          {/* GUJI SAWIRKA SI AAD U BEDDESHO (Kaliya haddii aad Admin tahay) */}
          <label className="profile-img-container">
            {isAdmin && <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />}
            <img 
              src={profileImage || "https://avatars.githubusercontent.com/u/197945084?v=4"} 
              alt="Eng Ahmed" 
              className="profile-img" 
            />
            {isAdmin && <div className="admin-overlay">BEDDEL SAWIRKA</div>}
          </label>
        </div>
        
        <h1 onClick={() => {
          setClickCount(prev => prev + 1);
          if (clickCount + 1 === 3) setIsAdmin(true); // 3-jeer markaad ku dhufato magaca, Upload ayaa kuu furmaya
          if (clickCount + 1 === 5) navigate('/driver-login'); // 5-jeer markaad ku dhufato, Driver Login
        }} style={styles.name}>Eng Ahmed Abdirisak Ali</h1>
        <p style={styles.title}>Fullstack Developer (Junior)</p>
        
        <div style={styles.bioCard}>
          <p style={styles.bioText}>
            Ku soo dhawaada Portfolio-gayga! Waxaan ahay horumariye dhisa <strong>Fullstack Applications</strong>. 
            App-ka <strong>DALMAR</strong> waa xal casri ah oo aan dhisay si aan u fududeeyo dalbashada bajaajta ee magaalada Garowe.
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
            <p>Dalabkaaga waa la gudbiyay, darawal ayaa kusoo wacaya.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' },
  heroSection: { textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  imageWrapper: { marginBottom: '20px' },
  name: { fontSize: '26px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' },
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
